# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :summary do |f|
  f.association :user, :factory => :user
  f.association :activity_word, :factory => :activity_word
  f.sequence(:activity_name) {|n|"word #{n}"}
end