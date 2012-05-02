require 'uri'
require 'cgi'

hash = {"www.mashable.com" => "technology", "www.techcrunch.com" => "technology"}
u = URI.parse("http://mashable.com/social/123/67")
if !hash[u.host].nil?
  puts hash[u.host]
end

SKIP_STORIES = /is now friends|likes|was tagged in/

text = "Alok Srivastava is now friends Shrek"

a = text.scan(SKIP_STORIES)
puts a
puts "hello" if !a.empty?
