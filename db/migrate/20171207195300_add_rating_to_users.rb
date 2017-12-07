class AddRatingToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :rating, :decimal, default: 0
    add_column :users, :rating_count, :integer, default: 0
  end
end
