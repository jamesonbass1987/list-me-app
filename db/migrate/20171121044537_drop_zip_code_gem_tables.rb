class DropZipCodeGemTables < ActiveRecord::Migration[5.1]
  def change
    drop_table :counties
    drop_table :states
    drop_table :zipcodes
  end
end
