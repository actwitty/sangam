# By using the symbol ':user', we get Factory Girl to simulate the User model.



Factory.define :user do |u|
  u.sequence(:email) { |n| "lemony#{n}@lemonbag.com" }
  u.password "lemonyssecret"
  u.password_confirmation { |u| u.password }
  u.sequence(:full_name){|n| "lemony lime" }
  u.sequence(:photo_small_url ){|n| "images/id_#{n}" }
  u.sequence(:username ){|n| "lemony_#{n}" }
  u.dob "15/12/978"
  u.current_location "bangalore"
  u.current_geo_lat "45.4567"
  u.current_geo_long "23.3456"
  u.gender "male"
  u.after_build do |user|

    #user.profile = Factory.build(:profile,
    #                             :user_id => user.id,
    #                             :email => user.email
    #                            )


  end
  u.after_create do |user|
     #   user.profile.save
  end
end
