class CommentsController < ApplicationController
  before_action :find_comment, only: [:edit, :show, :destroy, :update]

  def create
    @listing = Listing.find_by(id: params[:listing_id])

    @comment = Comment.new(comment_params)
    @comment.user = current_user
    @comment.save

    redirect_to location_listing_path(@listing.location, @listing) and return
  end

  def edit
    @statuses = CommentStatus.all
  end

  def update
    if @comment.update_attributes(comment_params)
      redirect_to location_listing_path(@comment.listing.location, @comment.listing)
    else
      render 'edit'
    end
  end

  def destroy
    listing = @comment.listing
    @comment.destroy!

    redirect_to(location_listing_path(listing.location, listing))
  end

  private
  def comment_params
    params.require(:comment).permit(:content, :user_id, :listing_id, :comment_status_id)
  end

  def find_comment
    @comment = Comment.find_by(id: params[:id])
  end
end
