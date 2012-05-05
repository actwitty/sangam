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


url = "http://www.dailymail.co.uk/sport/cricket/article-2097152/England-lose-Test-Pakistan-slump-3-0-whitewash.html"

categories = Containers::Trie.new

categories.push("technology", true)
categories.push("entertainment", true)
categories.push("sports", true)

found = false
u= URI.parse(url)
a = u.path.split("/")
a.each do |attr|
  if !categories.longest_prefix(attr).nil?
    found = true
    break
  end
end

puts found
