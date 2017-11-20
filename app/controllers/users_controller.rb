class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy, :settings]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render :new
    end
  end

  def update

    if @user.update_attributes(user_params)
      redirect_to user_path(@user)
    else
      render 'edit'
    end

  end

  def destroy

    @user.destroy
    redirect_to root_path
  end

  def settings

  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name, :profile_image_url)
  end

  def set_user
    @user = User.find_by(id: params[:id])
  end

end
