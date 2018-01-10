module CommentsHelper

  def display_listing_comments(comments)
    if comments.first.id.present?
      render comments
    else
      tag.text("There doesn't seem to be anything here.") + tag(:br)
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
    else
      tag.strong(link_to "Log In", login_path) + " or " + tag.strong(link_to "Sign Up", signup_path) + " to ask the seller a question."
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
