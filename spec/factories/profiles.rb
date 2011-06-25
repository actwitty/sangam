Factory.define :profile do |p|
  p.sequence(:first_name) { |n| "LemonyFirst#{n}" }
  p.sequence(:last_name)  { |n| "LemonyLast#{n}" }
  p.sequence(:short_status)  { |n| "Status of crushed lemon#{n}" }
  p.sequence(:sex)  { "male" }
  p.sequence(:dob)  { "01/01/2011" }  
end


