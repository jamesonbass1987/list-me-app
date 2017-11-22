class AddSlugToLocation < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :slug, :string, unique: true
  end
end
