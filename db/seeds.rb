# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


User.create(first_name: 'Jameson', last_name: 'Bass', email:'jamesonbass@gmail.com', password: 'password', profile_image_url: 'https://avatars3.githubusercontent.com/u/21073456?s=460&v=4')

Location.create(state: "NY", city: "New York")
Location.create(state: "OR", city: "Portland")
Location.create(state: "TN", city: "Nashville")
Location.create(state: "CA", city: "Los Angeles")
Location.create(state: "CA", city: "San Francisco")
Location.create(state: "TX", city: "Austin")
Location.create(state: "IL", city: "Chicago")


Category.create(name: "Furniture")
Category.create(name: "Books")
Category.create(name: "Appliances")
Category.create(name: "Cell Phones")
Category.create(name: "Electronics & Computers")
Category.create(name: "Musical Instruments")
Category.create(name: "Household")
Category.create(name: "Jewelry")
Category.create(name: "Toys & Games")
Category.create(name: "Video Games")
Category.create(name: "Collectibles")


25.times do
  Listing.create(title: Faker::Hipster.sentence, description: Faker::Hipster.paragraphs(1), price:
  Faker::Commerce.price, category_id: rand(21...31), location_id: rand(1...7))
end


15.times do
  tag = Tag.find_or_create_by(name: Faker::DrWho.specie)
  listing = Listing.find_by(id: rand(1...28))
  listing.tags << tag
end

50.times do
  tag = Tag.find_or_create_by(name: Faker::Commerce.product_name)
  listing = Listing.find_by(id: rand(1...28))
  listing.tags << tag
end
