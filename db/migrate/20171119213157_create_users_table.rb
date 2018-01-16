class CreateUsersTable < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :password_digest
      t.string :username
      t.string :slug, unique: true
      t.integer :role_id, :default => 1 
      t.string :profile_image_url, :string, :default => 'https://i.imgur.com/jNNT4LE.jpg'
      t.integer :location_id
    end
  end
end
