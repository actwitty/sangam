# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :campaign do |f|
  f.sequence(:name)  {|n| "campaign name #{n}"}
  f.sequence(:value)  {|n| "value #{n}"}
  f.sequence(:source_name)  {|n| AppConstants.source_actwitty}
  f.sequence(:status)  {|n| AppConstants.status_public}
  f.association :author, :factory => :user
  f.association :father, :factory => :activity
  f.association :activity, :factory => :activity
end