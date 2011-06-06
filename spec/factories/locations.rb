# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :location do |f|
  f.sequence(:location_type) {|n|(n % 3) + 1 }
  f.sequence(:location_name) {|n|"Location name #{n}" }
end