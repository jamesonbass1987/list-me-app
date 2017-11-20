class Category < ApplicationRecord
  has_many :sub_categories
  has_many :listings
end
