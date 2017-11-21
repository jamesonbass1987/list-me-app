# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171121044537) do

  create_table "categories", force: :cascade do |t|
    t.string "name"
  end

  create_table "listing_images", force: :cascade do |t|
    t.integer "listing_id"
    t.string "image_url"
  end

  create_table "listing_tags", force: :cascade do |t|
    t.integer "listing_id"
    t.integer "tag_id"
  end

  create_table "listings", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.decimal "price"
    t.integer "location_id"
    t.integer "user_id"
    t.integer "category_id"
  end

  create_table "locations", force: :cascade do |t|
    t.string "city"
    t.string "state"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "first_name"
    t.string "last_name"
    t.string "profile_image_url", default: "https://i.imgur.com/jNNT4LE.jpg"
    t.string "uid"
  end

end
