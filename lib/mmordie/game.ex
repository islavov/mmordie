defmodule Mmordie.Map do
  @size 18

  defstruct size: %{x: @size, y: @size}, data: nil

  def make_map do
    for _n <- 1..@size*@size do
      Enum.random([0,1])
    end
  end

  def size do
    @size
  end
end

defmodule Mmordie.Game do
  use Phoenix.Channel
  require Logger

  def start_link do
    # init random generator
    :random.seed(:os.timestamp)
    # start storage
    Agent.start_link(fn -> %{} end, name: :game_store)

    # Init player container
    set("players", %{})
    set("stats", %{})

    {:ok, self}
  end

  # storage
  def get(key) do
    Agent.get(:game_store, fn map -> Map.get(map, key) end)
  end

  def set(key, value) do
    Agent.update(:game_store, fn map -> Map.put(map, key, value) end)
  end

  ##### GAME EVENTS #####
  def on_join(socket) do
    map = get("map")
    unless map do
      # init world
      map = %Mmordie.Map{data: Mmordie.Map.make_map()}
      set("map", map)
    end

    # init player
    player = Mmordie.Player.new(socket.id)
    players = get("players")
    players = Map.put(players, player.id, player)
    set("players", players)

    stats = Mmordie.PlayerStats.new(socket.id)
    statsmap = get("stats")
    statsmap = Map.put(statsmap, player.id, stats)
    set("stats", statsmap)

    push socket, "join",  %{map: map,
                            player: player,
                            stats: stats,
                           }
  end

  def on_disconnect(player_id) do
    Mmordie.Player.remove(player_id)
    Mmordie.PlayerStats.remove(player_id)
  end

  def update(:server, data) do
    send_response "new:update", %{players: Map.values(get("players")), stats: get("stats")}
  end

  def update(:client, data) do
    # TODO if player dead, remove it
    Mmordie.Player.update(data["id"], data)
  end

  def hit_player(:client, data) do
    Mmordie.Player.set_damage(data["id"], data["damage"])
  end

  defp send_response(response_type, data) do
    Mmordie.Endpoint.broadcast! "mmordie:game", response_type, data
  end
end
