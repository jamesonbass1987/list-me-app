module ListingsHelper

  def currently_in_listing_text(listing, assets)
    "None (Enter new links below)" if assets.empty?
  end

  def create_listing_link(location)
    if can? :create, Listing
       link_to("Create Listing", new_location_listing_path(location), :class => 'btn btn-outline-success btn-block')
    end
  end

  def display_edit_listing_instructions(content_type, string, f)
    if content_type.any?
      (f.label :listing_images, "Edit Current #{string} (Deselect To Remove From Listing)") + tag(:br)
    end
  end

  def display_take_my_money()
    link_to "Show me the best #{@location.city} has to offer.", "/locations/#{@location.id}/listings/take_my_money", :class => "btn btn-outline-success btn-block" 
  end

  def display_comment_form_heading
    if logged_in?
      tag.h4("Leave A Question For The Seller:", :class => 'heading-text')
    end
  end

  def display_owner_listing_controls(user, listing)
    if can? :manage, listing
      ((link_to 'Edit', edit_location_listing_path(listing.location, listing.id), :class=>"btn btn-outline-warning") + " " +
      (link_to 'Delete', location_listing_path(listing.location, listing), :method => :delete, :class=>"btn btn-outline-danger"))
    end
  end


end
