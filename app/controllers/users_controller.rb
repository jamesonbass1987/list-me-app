class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy, :user_rating]
  before_action :redirect_to_profile_if_logged_in, only: :new

  def index
    authorize! :index, current_user
    @users = User.all
  end

  def show
    authorize! :show, @user

    respond_to do |format|
      format.html { render 'show' }
      format.json { render json: @user }
    end
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.role_id ||= 1

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

  def user_rating
    rating = params[:user][:rating]
    calculate_new_rating(@user, rating)

    @user.save
    redirect_to user_path(@user)
  end

  # API CALLS

  def logged_in_user
    respond_to do |format|
      format.json {render json: current_user}
      format.html {redirect_to root_path}
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :username, :slug, :password, :password_confirmation, :profile_image_url, :role_id, :rating, :rating_count)
  end

  #set user based on id params for views
  def set_user
    @user = (User.find_by(slug: params[:id]) || User.find_by(id: params[:id]))
    redirect_to root_path unless @user
  end

  #calculate new user rating based off of submitted form rating
  def calculate_new_rating(user, new_rating)
    current_rating = user.rating
    current_rating_amt = user.rating_count

    #set current rating with a weighted score against total number of current ratings
    current_rating_weighted = (current_rating * current_rating_amt).to_f
    total_current_ratings_weighted = (current_rating_amt * 5).to_f

    #calculate new rating by adding submitted rating to current weighted ratings, and dividing that by total number of ratings
    new_rating_weighted = current_rating_weighted + new_rating.to_f
    total_new_ratings_weighted = ((current_rating_amt + 1) * 5).to_f

    #calculate new weighted rating out of 5
    new_rating = (new_rating_weighted/total_new_ratings_weighted) * 5

    #update user rating columns
    user.rating_count += 1
    user.rating = new_rating
  end

end
