class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user, :logged_in?, :navbar_locations_list, :parent_listing_for
  
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = exception.message
    redirect_to root_url
  end

  private
  #checks for a session id
  def logged_in?
    !!current_user
  end

  #returns current user based on session id
  def current_user
    User.find_by(id: session[:user_id])
  end

  #redirects to profile if a logged in non-admin user attempts to visit sign up or log in page
  def redirect_to_profile_if_logged_in
    if current_user && !current_user.admin?
      redirect_to user_path(current_user) and return
    end
  end

  #validates that the location id passed in exists, else redirect
  def validate_location

    if params[:location_id]
      location ||= (Location.find_by(slug: params[:location_id]) || Location.find_by(id: params[:location_id]))
    else
      location ||= (Location.find_by(slug: params[:id]) || Location.find_by(id: params[:id]))
    end

    redirect_to root_path unless location
  end

  #sets navbar dropdown locations list variable
  def navbar_locations_list
    Location.all
  end

  #recursively traverses through comment tree for parent listing to set @listing variable
  def parent_listing_for(comment)
    return comment.commentable if comment.commentable_type == 'Listing'
    parent_listing_for(comment.commentable)
  end

  def record_not_found(error)
    render :json => {:error => error.message}, :status => :not_found
  end 

end
