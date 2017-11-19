class CreateUsersTable < ActiveRecord::Migration[5.1]
  def change
    create_table :users_tables do |t|
      t.string :email
      t.string :password_digest
      t.string :first_name
      t.string :last_name
      t.string :profile_image_url
      t.integer :location_id
    end
  end
end
