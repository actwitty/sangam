module LocationRoutines
  def location_hash(loc)
    h = {}
    case loc.location_type
      when 1
        h = {:type => 1, :url => loc.location_url, :name => loc.location_name}
      when 2
        h = {:type => 2, :lat => loc.location_lat, :long => loc.location_long,
            :name => loc.location_name}
      when 3
        h = {:type => 3, :name => loc.location_name}
      else
        h = {}
    end
      h
  end
end
