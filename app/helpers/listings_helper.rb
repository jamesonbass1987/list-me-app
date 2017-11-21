module ListingsHelper

  def render_edit_post_checkboxes(location, listing, f)
    if !current_page?(new_location_listing_path(location, listing))
      render partial: 'text_field_checkboxes', locals: {listing: listing, f: f}
    end
  end

  def current_tags_in_listing_text(listing)
    "None (Enter new tags below)" if listing.tags.empty?
  end

  def tag_attributes_field(tag_fields)
    tag_fields.text_field :name unless tag_fields.object[:name].present?
  end

  def listings_list(listings)
    if listings
      render partial: 'listings_list', locals: {listings: listings}
    end
  end

  def current_listing_filter(listings, location)
    if listings == location.listings
      "Everything. The whole shebang. The whole kit and caboodle."
    else
      if listings
        listings.first.category.name
      else
        "Nothing..zilch..nada..zero. Unfortunately nobody is selling anything in that category. Try another filter."
      end
    end
  end

end
