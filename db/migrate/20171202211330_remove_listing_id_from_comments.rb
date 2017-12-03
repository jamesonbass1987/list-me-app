class RemoveListingIdFromComments < ActiveRecord::Migration[5.1]
  def change
    remove_column :comments, :listing_id
  end
end
