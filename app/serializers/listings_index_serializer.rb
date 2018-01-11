class ListingsIndexSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :title, :description, :price, :listing_images, :location
end
