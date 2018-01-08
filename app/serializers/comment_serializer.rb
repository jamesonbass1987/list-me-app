class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :user_id, :comment_status_id, :created_at, :commentable_id, :commentable_type
  belongs_to :commentable, polymorphic: true
  has_many :comments, as: :commentable, polymorphic: true
end
