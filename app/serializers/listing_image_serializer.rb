class ListingImageSerializer < ActiveModel::Serializer
  attributes :id, :image_url

  belongs_to :listing
end
