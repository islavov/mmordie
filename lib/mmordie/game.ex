defmodule Mmordie.Game do
  def start_link do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
#    :timer.send_interval(40, self(), :update)
    {:ok, self}
  end

  def get(value) do
    Agent.get(__MODULE__, fn map -> Map.get(map, value) end)
  end

  def set(key, value) do
    Agent.update(__MODULE__, fn map -> Map.put(map, key, value) end)
  end

  def handle_info(:udpate) do
    IO.write "ddfg"
    {:ok, self}
  end
end
