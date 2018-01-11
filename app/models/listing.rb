class Listing < ApplicationRecord
  belongs_to :location
  belongs_to :category
  belongs_to :user

  has_many :listing_images, :dependent => :destroy
  has_many :listing_tags, :dependent => :destroy
  has_many :tags, through: :listing_tags
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :comment_statuses, through: :comments

  validates :title, presence: true
  validates :price, presence: true
  validates :description, length: {:maximum => 1500}, presence: true

  accepts_nested_attributes_for :tags
  accepts_nested_attributes_for :listing_images

  before_create :add_default_image

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

  def self.listings_in_category(category, location)
    where("category_id = :category_id AND location_id = :location_id", category_id: category.id, location_id: location.id)
  end

  def self.highest_price_item(location)
    where("location_id = ?", location.id).order(price: :desc).select(:id).first
  end

  def self.all_user_listings(user)
    where(:user_id => user.id)
  end

  #add default image if none have been provided
  def add_default_image
    self.listing_images.build(image_url: 'listing-default-image.png') unless listing_images.first.present?
  end

end
