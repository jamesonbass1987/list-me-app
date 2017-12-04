class CommentsController < ApplicationController
  before_action :find_commentable, only: [:new, :create]

  def new
    @comment = @commentable.comments.new(user: current_user)
  end

  def create
    @comment = @commentable.comments.create(comment_params)
    @comment.user = current_user

    if @comment.save
      listing = parent_listing_for(@comment)
      redirect_to location_listing_path(listing.location, listing)
    end
  end

  def edit
    @comment = Comment.find_by(id: params[:id])
    @statuses = CommentStatus.all
  end

  def update
    @comment = Comment.find_by(id: params[:id])
    if @comment.update_attributes(comment_params)
      listing = parent_listing_for(@comment)
      redirect_to location_listing_path(listing.location, listing)
    else
      render 'edit'
    end
  end

  def destroy
    comment = Comment.find_by(id: params[:id])
    listing = parent_listing_for(comment)

    comment.destroy!
    redirect_to location_listing_path(listing.location, listing)
  end

  private
  def comment_params
    params.require(:comment).permit(:content, :user_id, :comment_status_id, :commentable_type, :commentable_id)
  end

  #sets comment for views based on commentable_type of comment or listing
  def find_commentable
    @commentable ||= Comment.find_by(id: params[:comment_id])
    @commentable ||= Comment.find_by(id: params[:comment][:commentable_id]) if params[:comment] && params[:comment][:commentable_type] == 'Comment'
    @commentable ||= Listing.find_by(id: params[:comment][:commentable_id]) if params[:comment] && params[:comment][:commentable_type] == 'Listing'

    redirect_if_commentable_invalid(@commentable)
  end

  #redirect if no commentable parent is found
  def redirect_if_commentable_invalid(commentable)
    if commentable.nil?
      redirect_back fallback_location: root_path
    end
  end
end
