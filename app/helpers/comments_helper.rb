module CommentsHelper

  def display_listing_comments(comments)
    if comments.first.nil? || comments.first.content.nil?
      "There doesn't seem to be anything here."
    else
    end
  end

  def owner_controls(comment)
    if comment.user == current_user
      link_to("Edit Comment", edit_location_listing_comment_path(@listing.location, @listing, comment), :class => 'btn btn-outline-warning') +
      link_to("Delete Comment", location_listing_comment_path(@listing.location, @listing, comment), :method => :delete, :class => 'btn btn-outline-danger')
    end
  end

  def reply_controls(comment)
    if !current_page?(action: 'new') && logged_in?
      link_to("Reply", new_comment_comment_path(comment), :class => 'btn btn-outline-info')
    end
  end


  def display_comment_status(comment, listing)
    if comment.user != listing.user
      tag(:br) + tag.strong("Status: ") + comment.comment_status.name
    end
  end

  def display_listing_comment_form(listing, comment)
    if logged_in?
      render partial: 'listings/listing_comment_form', locals: {location: listing.location, listing: listing, comment: comment}
    end
  end

  def display_in_reply_to_if_reply(comment)
    if comment.commentable_type == 'Comment'
      "(Replying to #{comment.commentable.user.username}) "
    end
  end

  def render_replies(comments)
    render comments unless current_page?(action: 'new')
  end

  def display_comment_form_statuses(statuses, f)
    if statuses.present?
      content_tag :div, :class => 'form-group' do
        f.label :comment_status_id, "Status"
        f.collection_select(:comment_status_id, statuses, :id, :name, {}, {:class => 'form-control custom-select btn'})
      end
    end
  end

  def commentable_form_header(commentable, comment)
    if commentable.commentable_type == 'Listing'
      "commentable.location, commentable, comment"
    else
      "commentable, comment"
    end
  end

end
