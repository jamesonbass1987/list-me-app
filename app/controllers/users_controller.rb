class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy, :settings]
  before_action :redirect_to_profile_if_logged_in, only: :new


  def index
    @users = User.all
    authorize! :index, current_user
  end

  def show
    authorize! :show, @user
    listing = Listing.find_by(id: 31)
    listing.pending_comments_count
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to(user_path(@user)) and return
    else
      render :new and return
    end
  end

  def edit
    authorize! :edit, @user
  end

  def update
    if @user.update_attributes(user_params)
      redirect_to(user_path(@user))
    else
      render 'edit'
    end
  end

  def destroy
    authorize! :destroy, @user

    session.delete :user_id
    @user.destroy

    redirect_to(root_path)
  end

  private
  def user_params
    params.require(:user).permit(:email, :username, :slug, :password, :password_confirmation, :profile_image_url, :role, :role_id)
  end

  #set user based on id params for views
  def set_user
    @user = User.find_by(slug: params[:id])
    redirect_to root_path unless @user
  end

end
