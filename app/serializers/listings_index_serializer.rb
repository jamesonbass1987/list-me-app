class ListingsIndexSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :price, :listing_images, :location
end
