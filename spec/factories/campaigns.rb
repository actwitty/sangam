# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :campaign do |f|
  f.sequence(:name)  {|n| "campaign name #{n}"}
  f.sequence(:value)  {|n| "value #{n}"}
  f.association :author, :factory => :user
  f.association :father, :factory => :activity
  f.association :activity, :factory => :activity
end