defmodule Mmordie.GameChannel do
  use Phoenix.Channel
  require Logger

  def join("mmordie:game", message, socket) do
    Process.flag(:trap_exit, true)
    Logger.debug "> New Player: #{inspect message}"
    :timer.send_interval(4000, :update)
    {:ok, socket}
  end

  def join("mmordie:" <> _private_subtopic, _message, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info({:after_join, msg}, socket) do
    broadcast! socket, "user:entered", %{user: msg["user_id"]}
    push socket, "join", %{status: "connected"}
    {:noreply, socket}
  end

  def handle_info(:update, socket) do
    broadcast! socket, "new:msg", %{user: "SYSTEM", body: "ping"}
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    Logger.debug"> leave #{inspect reason}"
    :ok
  end

  def handle_in("new:player_position", msg, socket) do
    #Logger.debug "> Player coordinates: #{inspect msg}"
    broadcast! socket, "new:player_position", %{user: msg["user"],
                                                position: msg["position"],
                                                options: msg["options"],
                                                velocity: msg["velocity"], }

    {:reply, {:ok, %{msg: msg["body"]}}, assign(socket, :user, msg["user"])}
  end
end
