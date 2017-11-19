class Listing < ApplicationRecord
  belongs_to :location
  belongs_to :sub_category
  has_many :listing_images
  has_many :listing_tags
  has_many :tags, through: :listing_tags
end
