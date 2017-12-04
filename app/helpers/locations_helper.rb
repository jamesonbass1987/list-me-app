module LocationsHelper

  def full_location_name(location)
    "#{location.city}, #{location.state}"
  end

end
