module CommentsHelper

  def display_listing_comments(comments)
    if !comments.first.nil? && !comments.first.content.nil?
      render partial: 'listings/listing_comments', locals: {comments: comments}
    end
  end

  def display_comment(comment)
    if !comment.id.nil?
      render partial: 'listings/comment', locals: {comment: comment}
    end
  end

  def display_comment_controls(comment)
    if comment.user == current_user
      link_to("Edit Comment", edit_location_listing_comment_path(@listing.location, @listing, comment), :class => 'btn btn-info') +
      link_to("Delete Comment", location_listing_comment_path(@listing.location, @listing, comment), :method => :delete, :class => 'btn btn-danger')
    end
  end

  def display_comment_status(comment)
    if comment.user != @listing.user
      "<strong>Status:</strong> #{comment.comment_status.name}".html_safe
    end
  end

end
