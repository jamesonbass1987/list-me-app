module SessionsHelper

  def user_login_links
    if (!current_page?(signup_path) && !current_page?(login_path)) || (logged_in? && !current_page?(user_path(current_user.id)))
      if logged_in?
          render 'shared/sign_out_link'
      else
          render 'shared/sign_up_sign_in_links'
      end
    end
  end

  def user_profile_link
    if logged_in?
      link_to 'My Profile', user_path(current_user), :class => 'nav-link'
    end
  end

end
