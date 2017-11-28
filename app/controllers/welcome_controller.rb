class WelcomeController < ApplicationController
  def index
    @locations = Location.all
    @categories = Category.all
  end

  def search
    location = Location.friendly.find(params[:location_selector])
    session[:category_id_filter] = params[:category_selector]
    
    redirect_to(location_listings_path(location))
  end

end
