class ListingImage < ApplicationRecord
  belongs_to :listing

  validates :image_url, presence: true
  validate :is_an_image_url

  def is_an_image_url
    if !image_url.end_with?('jpg', 'png', 'gif')
      errors.add('', "must be a valid image url")
    end
  end

end
