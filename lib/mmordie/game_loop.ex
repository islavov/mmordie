defmodule Mmordie.GameLoop do
  def start_link do
    :timer.apply_interval(400, Mmordie.Game, :update, [])
    {:ok, self}
  end
end
