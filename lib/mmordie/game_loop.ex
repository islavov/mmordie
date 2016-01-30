defmodule Mmordie.GameLoop do
  def start_link do
    :timer.apply_interval(50, Mmordie.Game, :update, [:server, nil])
    {:ok, self}
  end
end
