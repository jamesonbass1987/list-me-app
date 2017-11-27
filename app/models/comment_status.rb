class CommentStatus < ApplicationRecord
  has_many :comments
  has_many :listings, through: :comments
end
