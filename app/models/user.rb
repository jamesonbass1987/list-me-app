class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :password, length: { in: 6..20,
    wrong_length: "Password must be between 6 and 20 characters." }
  validates :first_name, presence: true
  validates :last_name, presence: true

  has_secure_password
  has_many :listings
end
