class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user, :comment_status_id, :created_at, :commentable_id, :commentable_type, :comment_status, :comments
  
  has_many :comments, serializer: CommentSerializer
  belongs_to :user, serializer: CommentUserSerializer
  belongs_to :comment_status
end
