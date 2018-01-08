class TagSerializer < ActiveModel::Serializer
  attributes :id, :name

  belongs_to :listing
end
