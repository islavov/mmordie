defmodule Mmordie.GameChannel do
  use Phoenix.Channel
  alias Mmordie.Game
  require Logger

  def join("mmordie:game", message, socket) do
    Process.flag(:trap_exit, true)
    Logger.debug "> New Player: #{inspect message}"
    send(self, :after_join)
    {:ok, socket}
  end

  def join("mmordie:" <> _private_subtopic, _message, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info(:after_join, socket) do
    push socket, "join", %{status: "connected"}
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    Logger.debug"> leave #{inspect reason}"
    :ok
  end

  def handle_in("new:update", msg, socket) do
    # update state
    Game.update(:client, msg)
    # broadcast updated state of the world
    # broadcast! socket, "new:player_position", %{user: msg["user"],
    #                                             position: msg["position"],
    #                                             options: msg["options"],
    #                                             velocity: msg["velocity"], }
    {:noreply, socket}
  end
end
