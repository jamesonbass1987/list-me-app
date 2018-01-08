class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user_id, :comment_status_id, :created_at, :commentable_id, :commentable_type
  
  has_many :comments
end
