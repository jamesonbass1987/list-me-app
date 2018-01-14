class ListingsIndexSerializer < ActiveModel::Serializer
  attributes :id, :user, :category, :title, :description, :price, :listing_images, :location
end
