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
      ((link_to "Edit", edit_location_listing_path(@listing.location, @listing), :class => 'btn btn-outline-warning btn-block') + " " +
      (link_to 'Delete', location_listing_path(@listing.location, @listing), :method => :delete, :class => 'btn btn-outline-danger btn-block'))
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
      tag_fields.text_field :name, :class => 'form-control', placeholder: 'Add Tag'
    end
  end

  def display_empty_listing_image_fields(listing_images_fields)
    if listing_images_fields.object.image_url.nil?
      listing_images_fields.text_field :image_url, :class => 'form-control', placeholder: 'Add Image URL'
    end
  end

  def display_listing_image_cards(listing_image)
    if listing_image.object.id.present?
      content_tag :div, :class => 'card image-card edit-listing-card' do
        content_tag :div, :class =>'card-body text-center' do
          image_tag(listing_image.object.image_url, :class => 'mx-auto d-block card-img-top listing-card-img img-responsive ') + listing_image.check_box
        end
      end
    end
  end

  def display_edit_listing_instructions(content_type, string, f)
    if content_type.any?
      (f.label :listing_images, "Edit Current #{string} (Deselect To Remove From Listing)") + tag(:br)
    end
  end

  def image_carousel_class_tag(listing, image)
    if image == listing.listing_images.first
      "carousel-item active"
    else
      "carousel-item"
    end
  end

  def display_take_my_money(listings)
    link_to "Show me the best #{@location.city} has to offer.", "/locations/#{@location.id}/listings/take_my_money", :class => "btn btn-outline-success btn-block" unless listings.empty?
  end

  def carousel_image_class_tag(image)
    if image.image_url != 'listing-default-image.png'
      image_dimensions = FastImage.size(image.image_url)
      if image_dimensions[0] > image_dimensions[1]
        "d-block img-fluid carousel-img-width-dominant"
      else
        "d-block img-fluid carousel-img-height-dominant"
      end
    end
  end
end
