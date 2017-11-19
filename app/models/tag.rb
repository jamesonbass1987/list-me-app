class Tag < ApplicationRecord
  have_many :listing_tags
  have_many :listings, through: :listing_tags
end
