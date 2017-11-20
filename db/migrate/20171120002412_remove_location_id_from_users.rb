class RemoveLocationIdFromUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :location_id
  end
end
