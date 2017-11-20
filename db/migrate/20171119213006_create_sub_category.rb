class CreateSubCategory < ActiveRecord::Migration[5.1]
  def change
    create_table :sub_categories do |t|
      t.string :name
      t.integer :category_id
    end
  end
end
