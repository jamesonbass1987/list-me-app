class SubCategory < ApplicationRecord
  validates :name, presence: true

  belongs_to :category
  has_many :listings
end
