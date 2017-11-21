class Location < ApplicationRecord
  validates :city, presence: true
  validates :state, presence: true
  has_many :listings, :dependent => :destroy

  def full_location_name
    city + ", " + state
  end
end
