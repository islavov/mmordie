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
    set("dead", %{})

    {:ok, self}
  end

  # storage
  def get(key) do
    Agent.get(:game_store, fn map -> Map.get(map, key) end)
  end

  def set(key, value) do
    Agent.update(:game_store, fn map -> Map.put(map, key, value) end)
  end

  def init_player(player_id) do
    if (player_id != :ok) do
        Logger.debug("New player #{player_id}")
        player = Mmordie.Player.new(player_id)
        players = get("players")
        players = Map.put(players, player.id, player)
        set("players", players)
        player
    end

  end

  def init_player_stats(player_id) do
    # what is this???
    if (player_id != :ok) do
        stats = Mmordie.PlayerStats.new(player_id)
        statsmap = get("stats")
        statsmap = Map.put(statsmap, player_id, stats)
        set("stats", statsmap)
        stats
    end
  end

  ##### GAME EVENTS #####
  def on_join(socket) do
    map = get("map")
    unless map do
      # init map
      map = Mmordie.Map.new()
      set("map", map)
    end

    # init player
    player = init_player(socket.id)
    stats = init_player_stats(socket.id)

    push socket, "join",  %{map: map,
                            player: player,
                            stats: stats,
                           }
  end

  def on_disconnect(player_id) do
    Logger.debug("Remove player #{player_id}")
    Mmordie.Player.remove(player_id)
    Mmordie.PlayerStats.remove(player_id)
  end

  def raise_dead(player_id, timestamp) do
    if (timestamp + 1 < :os.system_time(:seconds)) do
        init_player(player_id)
        init_player_stats(player_id)

        dead_players = get("dead")
        dead_players = Map.drop(dead_players, [player_id])
        set("dead", dead_players)
    end
  end

  def update(:server, _) do

    dead_players = get("dead")
    for {key, value} <- dead_players, do: raise_dead(key, value)

    send_response "new:update", %{players: Map.values(get("players")), stats: get("stats")}
  end

  def update(:client, data) do
    # TODO if player dead, remove it
    Mmordie.Player.update(data["id"], data)
  end

  def hit_player(:client, data) do
    player_id = Mmordie.Player.set_damage(data["id"], data["damage"])

    if player_id do
        dead_players = get("dead")
        dead_players = Map.put(dead_players, player_id, :os.system_time(:seconds))
        set("dead", dead_players)
    end
  end

  defp send_response(response_type, data) do
    Mmordie.Endpoint.broadcast! "mmordie:game", response_type, data
  end
end
