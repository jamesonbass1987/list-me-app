class CreateListingsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :listings do |t|
      t.string :title
      t.text :description
      t.decimal :price
      t.integer :location_id
      t.integer :category_id
      t.integer :user_id
    end
  end
end
