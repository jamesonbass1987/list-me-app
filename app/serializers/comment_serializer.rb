class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user, :comment_status_id, :created_at, :commentable_id, :commentable_type, :comments
  
  has_many :comments, serializer: CommentSerializer
  belongs_to :user, serializer: CommentUserSerializer
end
