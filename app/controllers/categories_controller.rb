class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  def index
    @categories = Category.all
  end

  def show
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      redirect_to categories_path
    else
      render :new
    end
  end

  def edit
    @category = Category.find_by(id: params[:id])
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

  def set_category
    @category = Category.find_by(id: params[:id])
  end

end
