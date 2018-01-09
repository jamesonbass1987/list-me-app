class CommentUserSerializer < ActiveModel::Serializer
  attributes :id, :username, :profile_image_url, :rating
end
