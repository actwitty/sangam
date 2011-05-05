# By using the symbol ':user', we get Factory Girl to simulate the User model.


Factory.define :profile do |p|
  p.sequence(:first_name) { |n| "LemonyFirst#{n}" }
  p.sequence(:last_name)  { |n| "LemonyLast#{n}" }
  p.sequence(:nick_name)  { |n| "SmartLemon#{n}" }
  p.sequence(:short_status)  { |n| "Status of crushed lemon#{n}" }
  p.sequence(:sex)  { "male" }
  p.sequence(:dob)  { "01/01/2011" }  
end


Factory.define :user do |u|
  u.sequence(:username) { |n| "LemonyDummy#{n}" }
  u.sequence(:email) { |n| "lemony#{n}@lemonbag.com" }
  u.password "lemonyssecret"
  u.password_confirmation { |u| u.password }
  
  u.after_build do |user|
    
      user.profile = Factory.build(:profile, 
                                :user_id => user.id,
                                :email => user.email
                             )    
  end
  u.after_create do |user|
    #user.profile.save    
  end
end