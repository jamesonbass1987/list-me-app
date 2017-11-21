class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create

    fb_auth ||= request.env["omniauth.auth"]

    if fb_auth
      user = User.find_or_create_by(email: fb_auth[:info][:email]) do |u|
        u.uid = fb_auth[:uid]
        u.profile_image_url = fb_auth[:info][:image]
        u.password = SecureRandom.hex(10) unless u.password.present?
        u.first_name = fb_auth[:info][:name].split(" ")[0]
        u.last_name = fb_auth[:info][:name].split(" ")[1]
      end
    else

      user = User.find_by(email: params[:user][:email])
      if user.authenticate(params[:user][:password])
        redirect_to user_path(user) and return
      else
        render :new
      end
    end

    session[:user_id] = user.id
    redirect_to user_path(user)
  end

  def destroy
    session.delete :user_id
    redirect_to root_path
  end

end
