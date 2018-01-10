class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :profile_image_url, :rating, :email, :role

  belongs_to :role
end
