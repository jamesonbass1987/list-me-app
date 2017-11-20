class ListingImage < ApplicationRecord
  validates :image_url, presence: true
  belongs_to :listing
end
