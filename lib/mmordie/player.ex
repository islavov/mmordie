defmodule Mmordie.Player do
  require Logger
  @sprites [:player1, :player2, :player3]

  defstruct id: -1, position: %{x: 0, y: 0}, velocity: %{x: 0, y: 0}, sprite: nil

  def get_random_sprite do
    Enum.random(@sprites)
  end

  def new(player_id) do
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
    # update loop is far more likely to wipe the changes a user made
    # and this is better for handling the case when multiple players are attacking the
    # same user. That is why I moved stats out of the players struct.
    statmap = Mmordie.Game.get("stats")
    stats = Map.get(statmap, player_id)

    keys = Map.keys(stats)

    stats = %Mmordie.PlayerStats{speed: stats.speed, damage: stats.damage,
                                 health: stats.health - damage, special: stats.special}

    Logger.debug("#{inspect stats}")
    statmap = Map.put(statmap, player_id, stats)
    Mmordie.Game.set("stats", statmap)
  end

  def update(player_id, player_data) do
    players = Mmordie.Game.get("players")
    player = Map.get(players, player_id)
    updated_player = %Mmordie.Player{id: player_id,
                                     position: player_data["position"],
                                     velocity: player_data["velocity"],
                                     sprite: player.sprite}
    players = Map.put(players, player_id, updated_player)
    Mmordie.Game.set("players", players)
  end
end
