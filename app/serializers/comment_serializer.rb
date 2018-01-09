class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :comment_status_id, :created_at, :commentable_id, :commentable_type
  
  has_many :comments
  belongs_to :user
  belongs_to :comment_status
end
