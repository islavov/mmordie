defmodule Mmordie.Player do
  defstruct id: -1, position: %{x: 0, y: 0}, velocity: %{x: 0, y: 0}, options: %{}
end


defmodule Mmordie.World do
  defstruct size: %{x: 18, y: 18, data: []}

  def generate do
    for n <- 1..18*18 do
      Enum.random([0,1])
    end
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
      map = Mmordie.World.generate()
      set("map", map)
      # init player
      player = %Mmordie.Player{id: socket.id}
      update_player(socket.id, player)
    end

    push socket, "join",  %{map: %{
                               x: 18,
                               y: 18,
                               data: map},
                            player: player
                           }
  end

  def on_disconnect(player_id) do
    remove_player(player_id)
  end

  def update(:server, data) do
    send_response "new:update", %{players: Map.values(get("players"))}
  end

  def update(:client, data) do
    # TODO if player dead, remove it
    update_player(data["id"], data)
  end

  defp send_response(response_type, data) do
    Mmordie.Endpoint.broadcast! "mmordie:game", response_type, data
  end

  ##### PLAYER FUNCTIONS #####
  # TODO move to player module
  defp remove_player(player_id) do
    players = Map.drop(get("players"), [player_id])
    set("players", players)
  end

  defp update_player(player_id, player_data) do
    players = get("players")
    player =  %Mmordie.Player{id: player_id,
                              position: player_data["position"],
                              options: player_data["options"],
                              velocity: player_data["velocity"]}
    players = Map.put(players, player_id, player)
    set("players", players)
  end
end
