class LocationsController < ApplicationController
  before_action :set_location, only: [:show, :edit, :update, :destroy]

  def index
    @locations = Location.all
  end

  def show
    @location = Location.find_by(id: params[:id])
    @categories = Category.all
    @listings = @location.listings
  end

  def new
    @location = Location.new
  end

  def create

    @location = Location.new(location_params)

    if @location.save
      redirect_to location_path(@location)
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
    redirect_to locations_path
  end

  private

  def location_params
    params.require(:location).permit(:city, :state)
  end

  def set_location
    @location = Location.find_by(id: params[:id])
  end
end
