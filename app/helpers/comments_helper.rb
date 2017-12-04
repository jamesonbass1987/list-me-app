module CommentsHelper

  def display_listing_comments(comments)
    if comments.first.nil? || comments.first.content.nil?
      "There doesn't seem to be anything here."
    else
    end
  end

  def owner_controls(comment)
    if comment.user == current_user
      link_to("Edit Comment", edit_comment_path(comment), :class => 'btn btn-outline-warning') +
      link_to("Delete Comment", comment_path(comment), :method => :delete, :class => 'btn btn-outline-danger')
    end
  end

  def reply_controls(comment)
    if !current_page?(action: 'new') && logged_in?
      link_to("Reply", new_comment_comment_path(comment), :class => 'btn btn-outline-info')
    end
  end


  def display_comment_status(comment)
    if comment.user != parent_listing_for(comment).user
      tag(:br) + tag.strong("Status: ") + comment.comment_status.name
    end
  end

  def display_listing_comment_form(comment)
    if logged_in?
      render partial: 'comments/comment_form', locals: {comment: comment, statuses: nil}
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

  def display_comment_form_statuses(f, statuses)
    if statuses.present?
      content_tag :div, :class => 'form-group' do
        f.label :comment_status_id, "Status"
        f.collection_select(:comment_status_id, statuses, :id, :name, {}, {:class => 'form-control custom-select btn'})
      end
    end
  end

  def reply_placeholder
    if current_page?(controller: 'comments', action: 'new')
      'Leave a reply...'
    else
      'Ask a question...'
    end
  end

end
