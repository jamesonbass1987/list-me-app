class ListingSerializer < ActiveModel::Serializer
  attributes :id, :description, :price, :location_id, :user_id, :category_id

  has_many :listing_images
end
