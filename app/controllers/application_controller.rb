class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?, :navbar_locations_list

  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = exception.message
    redirect_to root_url
  end

  private
  def set_listing
    @listing = Listing.find_by(id: params[:id])
  end

  def logged_in?
    !!current_user
  end

  def current_user
    User.find_by(id: session[:user_id])
  end

  def require_login
    redirect_to root_path unless logged_in?
  end

  def redirect_to_profile_if_logged_in
    if current_user
      redirect_to user_path(current_user)
      return
    end
  end

  def validate_location
    if params[:location_id]
      location ||= Location.friendly.find(params[:location_id])
    else
      location ||= Location.friendly.find(params[:id])
    end
    redirect_to root_path unless location
  end

  def navbar_locations_list
    Location.all
  end
end
