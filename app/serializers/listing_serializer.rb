class ListingSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :price, :location_id
  
  belongs_to :category
  belongs_to :user
  belongs_to :location
  
  has_many :listing_images
  has_many :comments, serializer: CommentSerializer
  has_many :tags
end
