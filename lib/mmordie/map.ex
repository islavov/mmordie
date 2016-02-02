defmodule Mmordie.Map do
  @size 18

  defstruct size: %{x: @size, y: @size}, data: nil

  def size do
    @size
  end

  def new(size \\ @size) do
    %Mmordie.Map{size: %{x: size, y: size}, data: make_terrain(size)}
  end

  def make_terrain(size) do
    for _n <- 1..size*size do
      Enum.random([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                   1, 2, 3, 4, 5])
    end
  end
end
