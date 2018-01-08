class LocationSerializer < ActiveModel::Serializer
  attributes :id, :city, :state, :slug

  has_many :listings
end
