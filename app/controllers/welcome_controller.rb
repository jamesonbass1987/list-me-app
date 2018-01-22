class WelcomeController < ApplicationController
  def index
    @locations = Location.all
    @categories = Category.all
  end

  #redirect to appropriate location and category filter based on homepage search
  def search
    location = Location.friendly.find(params[:location_selector])
    session[:categoryFilter] = params[:categoryFilter]

    redirect_to(location_listings_path(location))
  end

end
