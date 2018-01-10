class ListingSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :price, :listing_images, :location, :tags
  
  belongs_to :category
  belongs_to :user
  belongs_to :location
  
  has_many :listing_images
  has_many :tags
  has_many :comments
end
