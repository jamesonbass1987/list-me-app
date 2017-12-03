class CommentsController < ApplicationController
  before_action :find_commentable

  def new
    @comment = @commentable.comments.build
    @listing = comment_parent_listing(@comment)
  end

  def create
    set_new_comment_variable(@commentable)
    if @comment.save
      listing = comment_parent_listing(@comment)
      redirect_to location_listing_path(listing.location, listing)
    end
  end

  def edit
    @listing = comment_parent_listing(@commentable)
    @statuses = CommentStatus.all
  end

  def update
    if @commentable.update_attributes(comment_params)
      listing = comment_parent_listing(@commentable)
      redirect_to location_listing_path(listing.location, listing)
    else
      render 'edit'
    end
  end

  def destroy
    listing = comment_parent_listing(@commentable)

    @commentable.destroy!
    redirect_back fallback_location: location_listing_path(listing.location, listing)
  end

  private
  def comment_params
    params.require(:comment).permit(:content, :user_id, :comment_status_id, :commentable_type, :commentable_id)
  end

  #sets comment for views based on id param of a comment or listing
  def find_commentable
    @commentable ||= Comment.find_by(id: params[:id]) if params[:id]
    @commentable ||= Comment.find_by(id: params[:comment_id]) if params[:comment_id]
    @commentable ||= Listing.find_by(id: params[:listing_id]) if params[:listing_id]
  end

  #recursively traverses through comment tree for parent listing to set @listing variable
  def comment_parent_listing(comment)
    return comment.commentable if comment.commentable_type == 'Listing'
    comment_parent_listing(comment.commentable)
  end

  #set @comment variable, if statement is based on whether it is a comment on a listing, or a reply to another
  #comment (where commenteable would be present)
  def set_new_comment_variable(commentable)
    if commentable.present?
      @comment = commentable.comments.create(comment_params)
    else
      @comment = Comment.new(comment_params)
      @commentable = @comment.commentable = Listing.find_by(params[:listing_id])
    end
    @comment.user = current_user
  end

end
