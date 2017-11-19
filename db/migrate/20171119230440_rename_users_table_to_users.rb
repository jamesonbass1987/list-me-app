class RenameUsersTableToUsers < ActiveRecord::Migration[5.1]
  def change
    rename_table :users_tables, :users
  end
end
