class User < ApplicationRecord
  has_secure_password
  has_many :listings
  belongs_to :location
end
