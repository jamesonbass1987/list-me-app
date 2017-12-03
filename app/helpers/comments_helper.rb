module CommentsHelper

  def display_listing_comments(comments)
    if comments.first.nil? || comments.first.content.nil?
      "There doesn't seem to be anything here."
    else
    end
  end

  def display_comment(comment)
    if !comment.id.nil?
      render partial: 'listings/comment', locals: {comment: comment}
    end
  end

  def owner_controls(comment)
    if comment.user == current_user
      tag(:br) + link_to("Edit Comment", edit_location_listing_comment_path(@listing.location, @listing, comment), :class => 'btn btn-outline-warning') +
      link_to("Delete Comment", location_listing_comment_path(@listing.location, @listing, comment), :method => :delete, :class => 'btn btn-outline-danger')
    end
  end

  def reply_controls(comment)
    if !current_page?(action: 'new')
      link_to("Reply", new_comment_comment_path(comment), :class => 'btn btn-outline-info')
    end
  end


  def display_comment_status(comment, listing)
    if comment.user != listing.user
      tag.strong("Status: ") + comment.comment_status.name
    end
  end

  def display_comment_form(listing, comment)
    if logged_in?
     render partial: 'listings/comment_form', locals: {location: listing.location, listing: listing, comment: comment}
    end
  end

  def display_comment_replies(comment)
    if comment.comments.present? && !current_page?(action: 'new')
      comment.comments.each do |reply|
        render partial: 'comments/comment', locals: {comment: reply}
      end
    end
  end

  def display_in_reply_to_if_reply(comment)
    if comment.commentable_type == 'Comment'
      "(Replying to #{comment.commentable.user.username}) "
    end
  end

end
