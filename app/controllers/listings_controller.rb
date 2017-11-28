class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy]
  before_action :validate_location
  before_action :validate_listings, except: [:index, :new, :create, :destroy, :take_my_money]

  def index
    @location = Location.friendly.find(params[:location_id])
    @categories = Category.all

    if session[:category_id_filter].present?
      #find category by category_id_filter and clear session data once done
      category_filter = Category.find_by(id: session[:category_id_filter])
      session[:category_id_filter].clear
      @listings = Listing.listings_in_category(category_filter, @location)
    elsif params[:search].present?
      search_term = params[:search].strip
      @listings = listings_matching_query(search_term, @location.listings)
    else
      @listings = @location.listings
    end
  end

  def show
    @comment = @listing.comments.build
  end

  def new
    @location = Location.friendly.find(params[:location_id])
    @listing = @location.listings.build
    @categories = Category.all
    build_tags_and_images(@listing)
  end

  def create
    @listing = Listing.new(listing_params)
    @listing.user = current_user

    if @listing.save
      redirect_to location_listing_path(@listing.location, @listing)
    else
      @categories = Category.all
      render :new
      return
    end
  end

  def edit
    @categories = Category.all
    build_tags_and_images(@listing)
  end

  def update
    if @listing.update_attributes(listing_params)
      redirect_to location_listing_path(@listing.location, @listing)
    else
      render 'edit'
    end
  end

  def destroy
    location = @listing.location
    @listing.destroy
    redirect_to location_listings_path(location)
  end

  def take_my_money
    location = Location.friendly.find(params[:id])
    listing = Listing.highest_price_item(location)

    redirect_to location_listing_path(listing.location, listing)
  end

  private
  def listing_params
    params.require(:listing).permit(:title, :description, :price, :location_id, :user_id, :category_id, tag_ids:[], tags_attributes:[:name], listing_image_ids:[], listing_images_attributes:[:image_url])
  end

  def validate_listings
    location_from_params = Location.friendly.find(params[:location_id])

    redirect_to location_listings_path(location_from_params)
    unless @listing && @listing.location == location_from_params
  end

  def listings_matching_query(search_term, listings)
    listings.find_all do |listing|
      listing.title.downcase.include?(search_term) ||
      listing.description.downcase.include?(search_term.downcase) ||
      listing.tags.any?{|tag| tag.name.include?(search_term.downcase)}
    end
  end

  def build_tags_and_images(listing)
    5.times {listing.listing_images.build}
    5.times {listing.tags.build}
  end
end
