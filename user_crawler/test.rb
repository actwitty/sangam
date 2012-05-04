require 'uri'
require 'cgi'

hash = {"mashable.com" => "technology", "www.techcrunch.com" => "technology"}
u = URI.parse("http://mashable.com:80/social/123/67")
puts u.host
if !hash[u.host].nil?
  puts hash[u.host]
end

SKIP_STORIES = /is now friends|likes|was tagged in/

text = "Alok Srivastava is now friends Shrek"

a = text.scan(SKIP_STORIES)
puts a
puts "hello" if !a.empty?


if !"mashable".nil? and "mashable" =~ /^[\w]{5,32}$/
  puts "wow"
end
