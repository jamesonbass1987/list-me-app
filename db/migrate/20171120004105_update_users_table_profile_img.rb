class UpdateUsersTableProfileImg < ActiveRecord::Migration[5.1]
  def change
    change_column :users, :profile_image_url, :string, :default => 'https://i.imgur.com/jNNT4LE.jpg'
  end
end
