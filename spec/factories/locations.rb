# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :location do |f|
  f.sequence(:location_type) {|n| 1}
end