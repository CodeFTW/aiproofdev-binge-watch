class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  # Add associations if needed
  # has_many :posts
  # has_many :comments
end
