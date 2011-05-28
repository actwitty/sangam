# Read about factories at http://github.com/thoughtbot/factory_girl

#Factory.define :activity do |f|
#  f.activity_identifier 1
#  f.activity_type 1
#  f.activity_text "MyText"
#end

Factory.define :activity do |f|
  f.association :author, :factory => :user
  f.sequence(:activity_identifier) {|n| n}
  f.sequence(:activity_type) {|n| n}
  f.sequence(:activity_text) {|n| "MyText #{n}" }
end