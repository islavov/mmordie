defmodule Mmordie.Game do
  require Logger

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

  def update(:server, data) do
    Logger.debug "Update server #{inspect data}"
  end

  def update(:client, data) do
    Logger.debug "Update client #{inspect data}"
    Mmordie.Endpoint.broadcast! "mmordie:game", "new:update", %{user: data["user"],
                                                              position: data["position"],
                                                              options: data["options"],
                                                              velocity: data["velocity"]}
  end
end
