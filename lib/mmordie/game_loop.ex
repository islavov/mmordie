defmodule Mmordie.GameLoop do
  def start_link do
    :timer.apply_interval(10, Mmordie.Game, :update, [:server, nil])
    {:ok, self}
  end
end
