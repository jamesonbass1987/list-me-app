class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?

  private

  def logged_in?
    !!current_user
  end

  def current_user
    User.find_by(id: session[:user_id])
  end

  def require_login
    redirect_to root_path unless logged_in?
  end

  def validate_location
    location ||= Location.friendly.find(params[:location_id])
    redirect_to root_path unless location
  end


end
