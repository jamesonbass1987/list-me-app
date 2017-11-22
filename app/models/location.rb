class Location < ApplicationRecord
  validates :city, presence: true
  validates :state, presence: true
  has_many :listings, :dependent => :destroy

  before_create :set_full_location_name

  extend FriendlyId
  friendly_id :location_long_name, use: :slugged

  def full_location_name
    city + ", " + state
  end

  def set_full_location_name
    self.location_long_name = self.city + " " + self.state
  end

end
