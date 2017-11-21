module SessionsHelper

  def user_login_links
    if (!current_page?(signup_path) && !current_page?(login_path)) || (logged_in? && !current_page?(user_path(current_user.id)))
      if logged_in?
          content_tag(:li, (link_to "Sign out", logout_path, method: :delete)) +
          content_tag(:li, "Currently signed in as #{current_user.email}")
      else
          content_tag(:li, (link_to "Sign in", login_path)) +
          content_tag(:li, (link_to "Sign up", signup_path))
      end
    end
  end

end
