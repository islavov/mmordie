defmodule Mmordie.GameChannel do
  use Phoenix.Channel
  alias Mmordie.Game
  require Logger

  def join("mmordie:game", message, socket) do
    Process.flag(:trap_exit, true)
    Logger.debug "> New Player: #{inspect socket}"
    send(self, :after_join)
    {:ok, socket}
  end

  def join("mmordie:" <> _private_subtopic, _message, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info(:after_join, socket) do
    Game.on_join(socket)
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    Game.on_disconnect(socket.id)
    :ok
  end

  def handle_in("new:update", msg, socket) do
    # update state

    Game.update(:client, msg)
    {:noreply, socket}
  end
end
