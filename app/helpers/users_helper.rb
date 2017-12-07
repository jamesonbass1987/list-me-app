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

  def display_user_profile_tools(user)
    if user == current_user
      tag.h3("Account Settings:", :class => 'heading-text') +
      link_to("Edit Profile", edit_user_path, :class => 'btn btn-block btn-outline-warning') +
      link_to("Delete Account", user_path(user.id), :method => :delete, :class => 'btn btn-block btn-outline-danger', data: { confirm: 'Are you sure you want to delete your profile?' })
    end
  end

  def display_user_heading(user)
    if user == current_user
      "Welcome #{@user.username}!"
    else
      "#{@user.username}'s Profile"
    end
  end

  def display_user_rating(user)
    if user.rating > 0
      "(#{user.rating})"
    else
      "(No Ratings Yet)"
    end
  end

  def display_rating_dropdown(user)
    if user != current_user && logged_in?
      render partial: 'user_rating', locals: {user: @user}
    end
  end
end
