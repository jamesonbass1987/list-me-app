class Listing < ApplicationRecord
  validates :title, presence: true
  validates :price, presence: true
  validates :description, length: {:maximum => 500}

  belongs_to :location
  belongs_to :category
  belongs_to :user
  has_many :listing_images, :dependent => :destroy
  has_many :listing_tags
  has_many :tags, through: :listing_tags

  accepts_nested_attributes_for :tags
  accepts_nested_attributes_for :listing_images

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

  def listing_images_attributes=(listing_images_attributes)
    #parse tag_attributes passed in as hash, checking for empties
    listing_images_attributes.values.each do |listing_image_attribute|
      if listing_image_attribute[:image_url].present?
        #initializes a new listing_image for listings that haven't been persisted
        image = ListingImage.find_or_initialize_by(image_url: listing_image_attribute[:image_url])
        if !self.listing_images.include?(image)
          self.listing_images << image
        end
      end
    end
  end

  def overview
    title + " - $" + price.to_f.to_s
  end

  def self.listings_in_category(category, location)
      where("category_id = ? AND location_id = ?", category.id, location.id)
  end

end
