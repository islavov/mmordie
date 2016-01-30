defmodule Mmordie.Game do
  def start_link do
    # start storage
    Agent.start_link(fn -> %{} end, name: :game_store)
    {:ok, self}
  end

  # storage
  def get(value) do
    Agent.get(:game_store, fn map -> Map.get(map, value) end)
  end

  def set(key, value) do
    Agent.update(:game_store, fn map -> Map.put(map, key, value) end)
  end

  def update do
    IO.puts "update"
  end
end
