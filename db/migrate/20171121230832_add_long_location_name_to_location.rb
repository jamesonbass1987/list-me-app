class AddLongLocationNameToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :location_long_name, :string
  end
end
