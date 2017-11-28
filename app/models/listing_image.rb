class ListingImage < ApplicationRecord
  belongs_to :listing

  validates :image_url, presence: true
end
