module LocationsHelper

  def locations_list(locations)
    if locations
      render partial: 'locations_list', locals: {locations: locations}
    end
  end

  def full_location_name(location)
    "#{location.city}, #{location.state}"
  end

end
