defmodule Mmordie.GameChannel do
  alias Mmordie.Game.App, as: App
  use Phoenix.Channel
  require Logger

  def join("mmordie:game", message, socket) do
    Process.flag(:trap_exit, true)
    # init the game state store
    # start the game loop
    :timer.send_interval(40, :update)
    {:ok, socket}
  end

  def join("mmordie:" <> _private_subtopic, _message, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info({:after_join, msg}, socket) do
    broadcast! socket, "user:entered", %{user: msg["user"]}
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

  def handle_in("new:msg", msg, socket) do
    broadcast! socket, "new:msg", %{user: msg["user"], body: msg["body"]}
    {:reply, {:ok, %{msg: msg["body"]}}, assign(socket, :user, msg["user"])}
  end
end
