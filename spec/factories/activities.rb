# Read about factories at http://github.com/thoughtbot/factory_girl

#Factory.define :activity do |f|
#  f.activity_identifier 1
#  f.activity_type 1
#  f.activity_text "MyText"
#end

Factory.define :activity do |f|
  f.association :author, :factory => :user
  f.association :activity_word, :factory => :activity_word
  f.sequence(:activity_text) {|n| "MyText #{n}" }
  f.sequence(:activity_name) {|n| "Activity #{n}" }

end