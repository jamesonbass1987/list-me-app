class AddSubCategoryIdToListings < ActiveRecord::Migration[5.1]
  def change
    add_column :listings, :subcategory_id, :integer
  end
end
