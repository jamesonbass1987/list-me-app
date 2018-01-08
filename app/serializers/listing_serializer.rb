class ListingSerializer < ActiveModel::Serializer
  attributes :id, :description, :price, :location_id, :user_id, :category_id, :listing_image_ids

  has_many :listing_images
end
