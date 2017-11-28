class SessionsController < ApplicationController
  before_action :redirect_to_profile_if_logged_in, only: :new

  def new
    @user = User.new
  end

  def create
    fb_auth ||= request.env["omniauth.auth"]

    if fb_auth
      auth_by_facebook(fb_auth)
    else
      auth_by_username
    end

    session[:user_id] ||= @user.id

    if session[:user_id]
      redirect_to(user_path(@user))
    else
      render :new and return
    end
  end

  def destroy
    session.delete :user_id
    redirect_to(root_path)
  end

  private
  def auth_by_facebook(fb_auth)
    @user = User.find_or_create_by!(email: fb_auth[:info][:email]) do |u|
      u.uid = fb_auth[:uid]
      u.profile_image_url = fb_auth[:info][:image]
      u.password = SecureRandom.hex(10) unless u.password.present?
      u.first_name = fb_auth[:info][:name].split(" ")[0]
      u.last_name = fb_auth[:info][:name].split(" ")[1]
    end
  end

  def auth_by_username
    @user ||= User.find_by(username: params[:user][:username])
    if !@user.present? || !@user.authenticate(params[:user][:password])
      @user = User.new
      @user.errors[:base] << "Your login credentials were invalid. Please try again."
    end
  end
end
