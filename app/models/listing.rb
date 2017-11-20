class Listing < ApplicationRecord
  validates :title, presence: true
  validates :price, presence: true
  validates :description, length: {:maximum => 500}

  belongs_to :location
  belongs_to :location
  belongs_to :category
  has_many :listing_images
  has_many :listing_tags
  has_many :tags, through: :listing_tags
end
