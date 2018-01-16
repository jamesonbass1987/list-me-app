class CreateLocationsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :locations do |t|
      t.string :state
      t.string :city
      t.string :slug, unique: true
      t.string :location_long_name, :string
    end
  end
end
