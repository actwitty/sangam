require 'uri'
require 'cgi'
require './common.rb'

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

s = "alok 'srivast;ava".gsub(/\'|;/,"")
puts s

require 'algorithms'

stems = YAML.load_file("../config/stem_categories.yml")

STEM_CATEGORIES = Containers::Trie.new
stems.each do |k,v|
  STEM_CATEGORIES.push(k,v)
end

def extract_categories_from_url(url)
  category = {} 
  a = url.split(/\/|\./)

  a.each do |attr|
    s = STEM_CATEGORIES.longest_prefix(attr)
    if !s.blank?
      category = {:name => STEM_CATEGORIES[s], :score => 1.0}
      found = true
      break
    end
  end

  puts category
end
url = "http://political.dailymail.co.uk/sports/cricket/article-2097153/England-lose-Test-Pakistan-slump-3-0-whitewash.html"
extract_categories_from_url(url)
