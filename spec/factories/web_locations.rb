# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :web_location do |f|
  f.association :location
  f.sequence(:web_location_url) {|n| "http://www.gmail#{n}.com"}
  f.sequence(:web_location_title) {|n| "Web Title #{n}"}
end