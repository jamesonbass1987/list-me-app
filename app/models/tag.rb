class Tag < ApplicationRecord
  has_many :listing_tags
  has_many :listings, through: :listing_tags

  validates :name, presence: true

  before_create :strip_tag

  def strip_tag
    self.name = self.name.strip.downcase
  end

end
