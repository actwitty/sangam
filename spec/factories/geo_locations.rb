# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :geo_location do |f|
  f.association :location
  f.sequence(:geo_latitude) {|n| 25.567899 + n}
  f.sequence(:geo_longitude) {|n| 145.567899 + n}
  f.sequence(:geo_name) {|n| "geo Description #{n}" }
end