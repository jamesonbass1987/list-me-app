class LocationsController < ApplicationController
  before_action :validate_location, except: [:index, :new, :create, :update]
  before_action :set_location, only: [:show, :edit, :update, :destroy]

  # API CALLS

    def get_location
      location = Location.find_by(id: params[:location_id])
      render json: location;
    end

  # RESTFUL ROUTES

  def show
    authorize! :show, @locations

    @categories = Category.all
    @listings = @location.listings
  end

  def index
    authorize! :index, @locations
    @locations = Location.all
  end

  def new
    @location = Location.new
  end

  def create
    @location = Location.new(location_params)

    if @location.save
      redirect_to(location_path(@location))
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @location.update_attributes(location_params)
      redirect_to location_path(@location)
    else
      render 'edit'
    end
  end

  def destroy
    @location.destroy
    redirect_to(locations_path)
  end

  private
  def location_params
    params.require(:location).permit(:city, :state, :slug, :location_long_name)
  end

  #sets location for views based on id param
  def set_location
    @location = Location.friendly.find(params[:id])
  end
end
