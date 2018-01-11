class ListingsIndexSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :category, :title, :description, :price, :listing_images, :location
end
