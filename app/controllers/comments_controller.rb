class CommentsController < ApplicationController

  def create
    binding.pry

    listing = Listing.find_by(id: params[:listing_id])

    comment = Comment.new(comment_params)
    comment.user = current_user

    binding.pry

    comment.save

    redirect_to location_listing_path(listing.location, listing)
  end

  def edit
    @comment = Comment.find_by(id: params[:id])
  end

  def update
    @comment = Comment.find_by(id: params[:id])

    if @comment.update_attributes(comment_params)
      redirect_to location_listing_path(@comment.listing.location, @comment.listing)
    else
      render 'edit'
    end

  end

  def destroy
    comment = Comment.find_by(id: params[:id])
    listing = comment.listing

    comment.destroy

    redirect_to location_listing_path(listing.location, listing)
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :user_id, :listing_id, :comment_status_id)
  end

end
