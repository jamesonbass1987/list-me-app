class CommentSerializer < ActiveModel::Serializer
  attributes :comment_status, :id, :content, :created_at, :commentable_id, :commentable_type, :comments
  
  belongs_to :comment
  belongs_to :listing
  belongs_to :user
  has_many :comments, serializer: CommentSerializer
  belongs_to :comment_status
end
