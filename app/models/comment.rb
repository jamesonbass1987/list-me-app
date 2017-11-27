class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :listing
  belongs_to :comment_status
end
