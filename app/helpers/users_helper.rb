module UsersHelper

  def render_admin_field(user, f)
    if current_user && current_user.admin?
      f.collection_select :role_id, Role.all, :id, :title
    end
  end

  def render_profile_image_field(user, f)
    if user.persisted?
      f.text_field :profile_image_url.titleize
    end
  end

  def display_admin_profile_tools(user)
    if user == current_user && user.admin?
      locations = Location.all
      render 'admin_tools'
    end
  end
end
