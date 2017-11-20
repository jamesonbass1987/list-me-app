class Listing < ApplicationRecord
  validates :title, presence: true
  validates :price, presence: true
  validates :description, length: {:maximum => 500}

  belongs_to :location
  belongs_to :category
  belongs_to :user
  has_many :listing_images
  has_many :listing_tags
  has_many :tags, through: :listing_tags

  accepts_nested_attributes_for :tags

  def tags_attributes=(tag_attributes)
    #parse tag_attributes passed in as hash, checking for empties
    tag_attributes.values.each do |tag_attribute|
      if tag_attribute[:name].present?
        tag = Tag.find_or_create_by(name: tag_attribute[:name])
        if !self.tags.include?(tag)
          self.tags << tag
        end
      end
    end
  end

  def overview
    title + " - $" + price.to_f.to_s
  end

end
