class ListingImageSerializer < ActiveModel::Serializer
  attributes :id, :image_url, :listing_id

  belongs_to :listing
end
