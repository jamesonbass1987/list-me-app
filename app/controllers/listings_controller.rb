class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy]
  before_action :validate_location_listing, except: [:index]

  def index
    @location = Location.find_by(id: params[:location_id])
    @categories = Category.all

    if session[:category_id_filter].present?
      #find category by category_id_filter and clear session data once done
      category_filter = Category.find_by(id: session[:category_id_filter])
      session[:category_id_filter].clear

      @listings = Listing.listings_in_category(category_filter, @location)

    else
      @listings = @location.listings
    end

  end

  def show

  end

  def new
    @location = Location.find_by(id: params[:location_id])
    @listing = @location.listings.new
    @categories = Category.all

    5.times { @listing.tags.build }

  end

  def create

    @listing = Listing.new(listing_params)
    @listing.user = current_user

    if @listing.save
      redirect_to location_listing_path(@listing.location, @listing)
    else
      render :new
    end
  end

  def edit
    @categories = Category.all
  end

  def update

    if @listing.update_attributes(listing_params)
      redirect_to location_listing_path(@listing.location, @listing)
    else
      render 'edit'
    end
  end

  def destroy
    @listing.destroy
    redirect_to listings_path
  end

  private

  def listing_params
    params.require(:listing).permit(:title, :description, :price, :location_id, :user_id, :category_id, tag_ids:[], tags_attributes:[:name])
  end

  def set_listing
    @listing = Listing.find_by(id: params[:id])
  end

  def validate_location_listing
    location_from_params = Location.find_by(id: params[:location_id])
    redirect_to location_listings_path(location_from_params) unless @listing && @listing.location == location_from_params
  end

end
