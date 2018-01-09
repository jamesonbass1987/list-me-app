class CommentsController < ApplicationController
  before_action :find_commentable, only: [:new, :create]

  def new
    authorize! :new, Comment
    @comment = @commentable.comments.new(user: current_user)
  end

  def create
    @comment = @commentable.comments.create(comment_params)
    @comment.user = current_user
    @listing = parent_listing_for(@comment)

    #if save successful, redirect to listing page. if save unsuccessful
    #and routing from reply page, render comments#new, otherwise route
    #back to listing with errors
    @comment.save
    render json: @comment, status: 201

    # if @comment.save
    #   respond_to do |format|
    #     format.html { redirect_to location_listing_path(@listing.location, @listing) }
    #     format.json { render json: @comment, status: 201 }
    #   end
    # else
    #   if request.referer.include?('/comments/new')
    #     render 'new'
    #   else
    #     render 'listings/show'
    #   end
    # end
  end

  def edit
    authorize! :edit, Comment
    @comment = Comment.find_by(id: params[:id])
    @statuses = CommentStatus.all

    redirect_to root_path if @comment.nil?
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
    authorize! :destroy, Comment
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
