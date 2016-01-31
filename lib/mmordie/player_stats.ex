defmodule Mmordie.PlayerStats do
  @specials  %{ranged_attack: %{min_speed: 1, min_damage: 3, min_health: 1, special: 3},
                block_attack: %{min_speed: 1, min_damage: 1, min_health: 4, special: 2},
                double_attack: %{min_speed: 2, min_damage: 1, min_health: 1, special: 4}}
  @level_stats 20

  defstruct health: 1, speed: 1, damage: 1, special: nil

  def random_range(min_value, max_value) do
    min(min_value + :random.uniform(max_value), max_value)
  end

  def new(player_id) do
    special = Enum.random(Map.keys(@specials))
    stats = new_stat(special)
  end

  def remove(player_id) do
    stats = Map.drop(Mmordie.Game.get("stats"), [player_id])
    Mmordie.Game.set("stats", stats)
  end

  defp new_stat(:ranged_attack) do
    spec = @specials[:ranged_attack]
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :ranged_attack}
  end

  defp new_stat(:block_attack) do
    spec = @specials[:block_attack]
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :block_attack}
  end

  defp new_stat(:double_attack) do
    spec = @specials[:double_attack]
    speed = random_range(spec[:min_speed], 10)
    damage = random_range(spec[:min_damage], 10)
    health = random_range(spec[:min_health], 10)
    %Mmordie.PlayerStats{speed: speed, damage: damage, health: health, special: :double_attack}
  end
end
