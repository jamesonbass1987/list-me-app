module ListingImagesHelper

  def carousel_image_class_tag(image)
    if image.image_url.present? && image.image_url != 'listing-default-image.png'
      image_dimensions = FastImage.size(image.image_url)
      if image_dimensions[0] > image_dimensions[1]
        "d-block img-fluid carousel-img-width-dominant"
      else
        "d-block img-fluid carousel-img-height-dominant"
      end
    end
  end

  def image_carousel_class_tag(listing, image)
    if image == listing.listing_images.first
      "carousel-item active"
    else
      "carousel-item"
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

end
