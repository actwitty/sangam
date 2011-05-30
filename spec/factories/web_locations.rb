# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :web_location do |f|
  f.association :location
  f.sequence(:web_location_url) {|n| "http://www.gmail.com#{n}"}
  f.sequence(:web_location_title) {|n| "Web Title #{n}"}
  f.sequence(:web_location_desc) {|n| "Web Description #{n}" }
  f.sequence(:web_location_image_url) {|n| "http://www.testimgurl#{n}.com" }
end