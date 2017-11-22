module LocationsHelper

  def locations_list(locations)
    if locations
      render partial: 'locations_list', locals: {locations: locations}
    end
  end

end
