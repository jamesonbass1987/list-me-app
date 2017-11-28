module SessionsHelper

  def user_login_links
    if logged_in?
      content_tag(:li, link_to(("Signed in as #{current_user.username} | Sign Out"), logout_path, :method => :delete, :class => 'nav-link'), :class => 'nav-item')
    else
      content_tag(:li, (link_to "Sign in", login_path, :class => 'nav-link'), :class => 'nav-item') +
      content_tag(:li, (link_to "Sign up", signup_path, :class => 'nav-link'), :class => 'nav-item')
    end
  end

  def user_profile_link
    if logged_in?
      link_to 'My Profile', user_path(current_user), :class => 'nav-link'
    end
  end
end
