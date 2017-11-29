module ListingsHelper

  def currently_in_listing_text(listing, assets)
    "None (Enter new links below)" if assets.empty?
  end

  def current_listing_filter(listings, location)
    if listings == location.listings && location.listings.present?
      "Everything. The whole shebang. The whole kit and caboodle."
    else
      if listings.present?
        listings.first.category.name
      else
        "Nothing..zilch..nada..zero. Unfortunately nobody is selling anything here."
      end
    end
  end

  def delete_edit_listing_links(listing)
    if can? :destroy, listing
      ((link_to 'Delete', location_listing_path(@listing.location, @listing), :method => :delete, :class => 'btn btn-danger') + " " +
      (link_to "Edit", edit_location_listing_path(@listing.location, @listing), :class => 'btn btn-warning'))
    end
  end

  def display_owner_listing_controls(user, listing)
    if can? :manage, listing
      ((link_to 'Edit', edit_location_listing_path(listing.location, listing.id), :class=>"btn btn-outline-warning") + " " +
      (link_to 'Delete', location_listing_path(listing.location, listing), :method => :delete, :class=>"btn btn-outline-danger"))
    end
  end

  def create_listing(location)
    if can? :create, Listing
       link_to("Create Listing", new_location_listing_path(location), :class => 'btn btn-outline-success btn-block')
    end
  end

  def display_empty_tag_fields(tag_fields)
    if tag_fields.object.name.nil?
      tag_fields.text_field :name, :class => 'form-control', placeholder: 'Add Tags'
    end
  end

  def display_empty_listing_image_fields(listing_images_fields)
    if listing_images_fields.object.image_url.nil?
      listing_images_fields.text_field :image_url, :class => 'form-control', placeholder: 'Add Image URL'
    end
  end

  def display_listing_image_cards(listing_image)
    content_tag :div, :class => 'card image-card' do
      content_tag :div, :class =>'card-body text-center' do
        image_tag(listing_image.object.image_url, :class => 'card-img-top') + listing_image.check_box
      end
    end
  end

  def display_edit_listing_instructions(content_type, string, f)
    if content_type.any?
      (f.label :listing_images, "Edit Current #{string} (Deselect To Remove From Listing)") + tag(:br)
    end
  end
end
