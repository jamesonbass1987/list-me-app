class CreateCategoryTags < ActiveRecord::Migration[5.1]
  def change
    create_table :category_tags do |t|
      t.integer :category_id
      t.string :tag_name
    end
  end
end
