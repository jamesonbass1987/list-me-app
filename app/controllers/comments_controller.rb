class CommentsController < ApplicationController
  before_action :find_commentable

  def new
    @comment = @commentable.comments.build
    @listing = comment_parent_listing(@comment)
  end

  def create
    @comment = @commentable.comments.create(comment_params)
    @comment.user = current_user

    if @comment.save
      if @comment.commentable_type == 'Listing'
        redirect_back fallback_location: location_listing_path(@comment.commentable.location, @comment.commentable)
      else
        listing = Listing.find_by(id: params[:comment][:listing_id])
        redirect_to location_listing_path(listing.location, listing)
      end
    end

  end

  def edit
    @statuses = CommentStatus.all
  end

  def update
    if @comment.update_attributes(comment_params)
      redirect_back fallback_location: location_listing_path(listing.location, listing)
    else
      render 'edit'
    end
  end

  def destroy

    if @commentable.commentable_type == 'Listing'
      listing = @commentable.commentable
    else
    end

    @commentable.destroy!
    redirect_back fallback_location: location_listing_path(listing.location, listing)
  end

  private
  def comment_params
    params.require(:comment).permit(:content, :user_id, :comment_status_id, :commentable_type, :commentable_id)
  end

  #sets comment for views based on id param of a comment or listing
  def find_commentable
    @commentable = Comment.find_by_id(params[:id]) if params[:id]
    @commentable = Comment.find_by_id(params[:comment_id]) if params[:comment_id]
  end

  #recursively traverses through comment tree for parent listing to set @listing variable
  def comment_parent_listing(comment)
    return comment.commentable if comment.commentable_type == 'Listing'
    comment_parent_listing(comment.commentable)
  end

end
