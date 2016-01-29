ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Mmordie.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Mmordie.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Mmordie.Repo)

