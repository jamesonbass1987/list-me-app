class RemoveSubcategoryIdFromListings < ActiveRecord::Migration[5.1]
  def change
    remove_column :listings, :sub_category_id, :integer
    remove_column :listings, :subcategory_id, :integer
  end
end
