class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  def index
    @categories = Category.all
    authorize! :index, @categories
  end

  def show
    authorize! :show, @category
  end

  def new
    @category = Category.new
    authorize! :new, @category
  end

  def create
    @category = Category.new(category_params)
    authorize! :create, @category

    if @category.save
      redirect_to categories_path
    else
      render :new
    end
  end

  def edit
    authorize! :edit, @category
  end

  def update
    if @category.update_attributes(category_params)
      redirect_to categories_path
    else
      render 'edit'
    end
  end

  def destroy
    @category.destroy
    redirect_to categories_path
  end

  private
  def category_params
    params.require(:category).permit(:name)
  end

  #sets category based on id params for appropriate views
  def set_category
    @category = Category.find_by(id: params[:id])
  end
end
