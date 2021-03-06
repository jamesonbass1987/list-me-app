class ListingsController < ApplicationController
  before_action :set_listing, only: [:show, :edit, :update, :destroy, :listing_comments]
  before_action :validate_location, except: [:listing_comments]
  before_action :validate_listing, only: [:show, :edit, :destroy]

  # API CALLS
  def listing_comments
    comments = @listing.comments
    render json: comments, include: ['comments.**', 'user', 'comment_status']
  end

  def listing_ids
    location = Location.friendly.find(params[:id])
    listings = []
    location.listings.select(:id, :user_id).map do |listing| 
      listingHash = {id: listing.id, user_id: listing.user_id}
      listings.push(listingHash)
    end    
    render json: listings
  end

  # RESTFUL ROUTES
  def index
    @location = Location.friendly.find(params[:location_id])
    @categories = Category.all

    #There are three paths to the index controller: standard get request,
    #category filter, and search filter. Based on which is used,
    #the appropriate method is called to filter listings
    if params[:categoryFilter].present? || session[:categoryFilter].present?
      filter_listings_by_category
    elsif params[:searchQuery].present?
      filter_listings_by_search
    else
      @listings = @location.listings 
    end

    respond_to do |format| 
      format.html { render 'index' }
      format.json { render json: @listings, each_serializer: ListingsIndexSerializer }
    end
  end

  def show
    respond_to do |format|
      format.html { render 'show' }
      format.json { 
        render json: @listing, include: ['comments.**', 'listing_images', 'location', 'user', 'category']
      }
    end
  end

  def new
    authorize! :new, Listing

    @location = Location.friendly.find(params[:location_id])
    @listing = Listing.new(location_id: @location.id)
    @categories = Category.all
  end

  def create
    authorize! :create, Listing

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
  end

  def update
    if @listing.update_attributes(listing_params)
      redirect_to location_listing_path(@listing.location, @listing)
    else
      @categories = Category.all
      render 'edit'
    end
  end

  def destroy
    authorize! :destroy, @listing

    location = @listing.location
    @listing.destroy

    respond_to do |format|
      format.html {redirect_back fallback_location: location_listings_path(location) and return}
      format.json {render json: {:status => 500}.to_json}
    end
  end

  def take_my_money
    location = Location.friendly.find(params[:id])
    listing = Listing.highest_price_item(location)
    if listing
      redirect_to location_listing_path(location, listing) and return
    else
      redirect_to location_listings_path(location)
    end
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

  #find category by category_id_filter and clear session data once done
  def filter_listings_by_category
    category_filter = Category.find_by(id: (params[:categoryFilter] || session[:categoryFilter]))
    @listings = Listing.listings_in_category(category_filter, @location)
    session[:categoryFilter].clear if session[:categoryFilter]
  end

  #find category by search term and clear session data once done
  def filter_listings_by_search
    search_term = params[:searchQuery].strip
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
