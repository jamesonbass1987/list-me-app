module ListingsHelper

  def render_edit_post_checkboxes(location, listing, f)
    if !current_page?(new_location_listing_path(location, listing))
      render partial: 'tag_field_checkboxes', locals: {listing: listing, f: f}
    end
  end

  def render_image_post_checkboxes(location, listing, f)
    if !current_page?(new_location_listing_path(location, listing))
      render partial: 'image_field_checkboxes', locals: {listing: listing, f: f}
    end
  end

  def currently_in_listing_text(listing, assets)
    "None (Enter new links below)" if assets.empty?
  end

  def tag_attributes_field(tag_fields)
    tag_fields.text_field :name unless tag_fields.object[:name].present?
  end

  def listing_images_attributes_field(listing_image_fields)
    listing_image_fields.text_field :image_url unless listing_image_fields.object[:image_url].present?
  end

  def listings_list(listings)
    if listings
      render partial: 'listings_list', locals: {listings: listings}
    end
  end

  def listing_feature_image(listing)
    if !listing.listing_images.empty?
      image_tag listing.listing_images.first.image_url
    end
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

  def highest_price_item_link(location)
    if location.listings.present?
      link_to "Show me the best #{location.city} has to offer.", location_listing_path(location, Listing.highest_price_item(location))
    end
  end

  def delete_edit_listing_links(listing)
    if can? :destroy, listing
      ((link_to 'Delete', location_listing_path(@listing.location, @listing), :method => :delete, :class => 'btn btn-danger') + " " +
      (link_to "Edit", edit_location_listing_path(@listing.location, @listing), :class => 'btn btn-warning'))
    end
  end

  def listing_overview(listing)
    listing.title + " - " + number_to_currency(listing.price)
  end

end
