class ChangeCategoryTagsTableNameToSubCategory < ActiveRecord::Migration[5.1]
  def change
    rename_table :category_tags, :sub_categories
  end
end
