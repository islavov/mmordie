defmodule Mmordie.PlayerStats do
  @specials  %{ranged_attack: %{min_speed: 1, min_damage: 3, min_health: 1, special: 3},
                block_attack: %{min_speed: 1, min_damage: 1, min_health: 4, special: 2},
                double_attack: %{min_speed: 2, min_damage: 1, min_health: 1, special: 4}}
  @level_stats 20

  defstruct health: 1, speed: 1, damage: 1, special: nil

  def get_spec(key) do
    @specials[key]
  end

  def get_special_types do
    Map.keys(@specials)
  end
end

defmodule Mmordie.Player do
  @sprites [:player1, :player2, :player3]

  defstruct id: -1, position: %{x: 0, y: 0}, velocity: %{x: 0, y: 0}, stats: %Mmordie.PlayerStats{}, sprite: nil

  def get_random_sprite do
    Enum.random(@sprites)
  end
end

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
    player = make_player(socket.id)
    Logger.debug "#{inspect player}"
    push socket, "join",  %{map: map,
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

  def random_range(min_value, max_value) do
    min(min_value + :random.uniform(max_value), max_value)
  end

  ##### PLAYER FUNCTIONS #####
  # TODO move to player module
  defp make_player(player_id) do
    player = %Mmordie.Player{
      id: player_id,
      position: %{x: :random.uniform(Mmordie.Map.size),
                  y: :random.uniform(Mmordie.Map.size)},
      sprite: Mmordie.Player.get_random_sprite()
    }
    special = Enum.random((Mmordie.PlayerStats.get_special_types))
    stats = make_stats(special)
    Map.put(player, :stats, stats)
  end

  defp remove_player(player_id) do
    players = Map.drop(get("players"), [player_id])
    set("players", players)
  end

  defp update_player(player_id, player_data) do
    players = get("players")
    player =  %Mmordie.Player{id: player_id,
                              position: player_data["position"],
                              stats: player_data["stats"],
                              velocity: player_data["velocity"]}
    players = Map.put(players, player_id, player)
    set("players", players)
  end

  def make_stats(:ranged_atack) do
    spec = Mmordie.PlayerStats.get_spec(:ranged_attack)
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :ranged_attack}
  end

  def make_stats(:block_attack) do
    spec = Mmordie.PlayerStats.get_spec(:block_attack)
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :block_attack}
  end

  def make_stats(:double_attack) do
    spec = Mmordie.PlayerStats.get_spec(:double_attack)
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :double_attack}
  end
end
