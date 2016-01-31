defmodule Mmordie.Player do
  require Logger
  @sprites [:player1, :player2, :player3]

  defstruct id: -1, position: %{x: 0, y: 0}, velocity: %{x: 0, y: 0}, sprite: nil, action: "move"

  def get_random_sprite do
    Enum.random(@sprites)
  end

  def new(player_id) do
    :random.seed(:os.timestamp)

    player = %Mmordie.Player{
      id: player_id,
      position: %{x: :random.uniform(Mmordie.Map.size),
                  y: :random.uniform(Mmordie.Map.size)},
      sprite: Mmordie.Player.get_random_sprite()
    }
  end

  def remove(player_id) do
    players = Map.drop(Mmordie.Game.get("players"), [player_id])
    Mmordie.Game.set("players", players)
  end

  def set_damage(player_id, damage) do
    statmap = Mmordie.Game.get("stats")
    stats = Map.get(statmap, player_id)

    stats = %{stats | health: stats.health - damage}
    if stats.health > 0 do
      Mmordie.PlayerStats.update(player_id, stats)
    else
      Mmordie.Player.remove(player_id)
      Mmordie.PlayerStats.remove(player_id)
    end
  end

  def update(player_id, player_data) do
    players = Mmordie.Game.get("players")
    player = Map.get(players, player_id)
    updated_player = %Mmordie.Player{id: player_id,
                                     position: player_data["position"],
                                     velocity: player_data["velocity"],
                                     action: player_data["action"],
                                     sprite: player.sprite
                                     }
    players = Map.put(players, player_id, updated_player)
    Mmordie.Game.set("players", players)
  end
end
