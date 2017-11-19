class CategoryTag < ApplicationRecord
  belongs_to :category
  has_many :listings
end
