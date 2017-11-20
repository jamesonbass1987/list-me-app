class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy]

  def show
  end

  def new
    @location = Location.find_by(params[:location_id])
    @listing = @location.listings.new
  end

  def create

    @listing = Listing.new(listing_params)
    @listing.user = current_user

    if @listing.save
      session[:listing_id] = @listing.id
      redirect_to location_listing_path(@listing.location, @listing)
    else
      render :new
    end
  end

  def edit
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
    params.require(:listing).permit(:title, :description, :price, :location_id, :user_id, :category_id, tag_ids:[])
  end

  def set_listing
    @listing = Listing.find_by(id: params[:id])
  end

end
