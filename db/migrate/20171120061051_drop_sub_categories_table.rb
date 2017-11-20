class DropSubCategoriesTable < ActiveRecord::Migration[5.1]
  def change
    drop_table :sub_categories
  end
end
