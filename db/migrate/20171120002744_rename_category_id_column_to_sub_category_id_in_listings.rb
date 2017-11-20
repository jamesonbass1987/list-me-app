class RenameCategoryIdColumnToSubCategoryIdInListings < ActiveRecord::Migration[5.1]
  def change
    rename_column :listings, :category_id, :sub_category_id
  end
end
