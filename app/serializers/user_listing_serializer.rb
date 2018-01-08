class UserListingSerializer < ActiveModel::Serializer
  attributes :id, :title, :price

  has_many :listing_images
end
