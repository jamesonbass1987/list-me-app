module UsersHelper

  def render_admin_field(user, f)
    if logged_in? && current_user.admin?
      ((f.label :role_id, "Role") +
      (f.collection_select :role_id, Role.all, :id, :title, {}, {:class => 'form-control custom-select'}))
    end
  end

  def render_profile_image_field(user, f)
    if user.persisted?
      ((f.label :profile_image_url, "Profile Image URL") + (f.text_field :profile_image_url, :class => 'form-control'))
    end
  end

  def display_admin_profile_tools(user)
    if user == current_user && user.admin?
      locations = Location.all
      render 'admin_tools'
    end
  end
end
