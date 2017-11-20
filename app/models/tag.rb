class Tag < ApplicationRecord
  validates :name, presence: true
  have_many :listing_tags
  have_many :listings, through: :listing_tags
end
