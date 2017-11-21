class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6,
    wrong_length: "Password must be at least 6 characters." }, allow_nil: true
  validates :first_name, presence: true
  validates :last_name, presence: true

  has_secure_password
  has_many :listings, :dependent => :destroy


  def full_name
    first_name + " " + last_name
  end
end
