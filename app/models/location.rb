class Location < ApplicationRecord
  extend FriendlyId
  friendly_id :location_long_name, use: :slugged

  attr_reader :full_location_name

  validates :city, presence: true
  validates :state, presence: true
  has_many :listings, :dependent => :destroy

  before_create :set_location_slug

  def set_location_slug
    self.location_long_name = self.city + " " + self.state
  end

  def full_location_name
    city + ', ' + state
  end

end
