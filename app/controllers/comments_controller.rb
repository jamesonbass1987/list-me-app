class CommentsController < ApplicationController
  before_action :find_commentable, only: [:new, :create]

  def create
    @comment = @commentable.comments.build(comment_params)
    @comment.user = current_user
    @listing = parent_listing_for(@comment)
 
    #if save successful, redirect to listing page. if save unsuccessful
    #and routing from reply page, render comments#new, otherwise route
    #back to listing with errors
    if @comment.save
      respond_to do |format|
        format.json { render :json => @comment, :status => :created, :template => false }
      end
    end
  end

  def update
    @comment = Comment.find_by(id: params[:id])
    listing = parent_listing_for(@comment)

    @comment.update(comment_params)

    respond_to do |format|
      format.html { redirect_to location_listing_path(listing.location, listing) and return }
      format.json {render json: @comment, status: 200}
    end
  end

  def destroy
    authorize! :destroy, Comment
    comment = Comment.find_by(id: params[:id])
    listing = parent_listing_for(comment)

    comment.destroy

    respond_to do |format|
      format.html { redirect_to location_listing_path(listing.location, listing) and return}
      format.json {render json: "ok".to_json, status: 202}
    end
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
