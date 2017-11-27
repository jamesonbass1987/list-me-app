module UsersHelper


  def render_admin_field(user, f)
    if current_user && current_user.admin?
      render partial: 'admin_signup', locals: {user: user, f: f}
    end
  end

  def render_profile_image_field(user, f)
    if user.persisted?
      render partial: 'profile_image_field', locals: {user: user, f: f}
    end
  end

  def display_admin_profile_tools(user)
    if user == current_user && user.admin?
      locations = Location.all
      render partial: 'admin_tools', locals: {locations: locations}
    end
  end

end
