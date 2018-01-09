class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :profile_image_url, :rating

  has_many :listings
  has_many :comments
end
