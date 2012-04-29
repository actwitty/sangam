require 'uri'
require 'cgi'

TECH_SITES = /\.mashable\.|.\techcrunch.\./
u = URI.parse("http://www.mashable.com/social/123/67")
if u.host =~ TECH_SITES
  puts u.host
end

