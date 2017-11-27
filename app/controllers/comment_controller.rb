class CommentController < ApplicationController


  def create

  end

  def edit

  end

  def destroy

  end

  private

  def comment_params
    params.require(:comment).permit(:content, :user_id, :listing_id, :comment_status_id)
  end

end
