class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true, email: true #uses email_validator gem to validate email address
  validates :username, presence: true, uniqueness: true
  validates :password, length: { minimum: 6,
    wrong_length: "Password must be at least 6 characters." }, allow_nil: true

  extend FriendlyId
  friendly_id :username, use: :slugged

  has_secure_password
  has_many :listings, :dependent => :destroy
  belongs_to :role

  def admin?
    role.title == 'admin'
  end

end
