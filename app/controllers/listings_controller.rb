class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy]
  before_action :validate_location
  before_action :validate_listing, only: [:show, :edit, :create, :destroy]

  def index

    @location = Location.friendly.find(params[:location_id])
    @categories = Category.all

    #There are three paths to the index controller: standard get request,
    #category filter, and search filter. Based on which is used,
    #the appropriate method is called to filter listings

    if session[:category_id_filter].present?
      filter_listings_by_category
    elsif params[:search].present?
      filter_listings_by_search
    else
      @listings = @location.listings
    end
  end

  def show
    @comment = @listing.comments.build
  end

  def new
    authorize! :new, Listing
    
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
    authorize! :edit, @listing
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
    authorize! :destroy, @listing

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

  #set listing instance variable for related actions
  def set_listing
    @listing = Listing.find_by(id: params[:id])
  end

  #redirect user if they try and access a listing that is not part of the current location
  def validate_listing
    location_from_params = Location.friendly.find(params[:location_id])
    redirect_to location_listings_path(location_from_params) unless @listing && @listing.location == location_from_params
  end

  #build additional tag and image fields for listing edit/new actions
  def build_tags_and_images(listing)
    5.times {listing.listing_images.build}
    5.times {listing.tags.build}
  end

  #find category by category_id_filter and clear session data once done
  def filter_listings_by_category
    category_filter = Category.find_by(id: session[:category_id_filter])
    session[:category_id_filter].clear
    @listings = Listing.listings_in_category(category_filter, @location)
  end

  #find category by search term and clear session data once done
  def filter_listings_by_search
    search_term = params[:search].strip
    @listings = listings_matching_query(search_term, @location.listings)
  end

  #find all listings that match search query from search filter
  def listings_matching_query(search_term, listings)
    listings.find_all do |listing|
      listing.title.downcase.include?(search_term) ||
      listing.description.downcase.include?(search_term.downcase) ||
      listing.tags.any?{|tag| tag.name.include?(search_term.downcase)}
    end
  end
end
