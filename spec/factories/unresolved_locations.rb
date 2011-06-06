# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :unresolved_location do |f|
  f.association :location
  f.sequence(:unresolved_location_name) {|n| "Unresolved location {n} hello"}
end