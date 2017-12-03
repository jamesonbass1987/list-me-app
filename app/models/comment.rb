class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :comment_status

  belongs_to :commentable, polymorphic: true

  has_many :comments, as: :commentable, dependent: :destroy

  validates :content, presence: true
end
