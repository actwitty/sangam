# By using the symbol ':user', we get Factory Girl to simulate the User model.



Factory.define :user do |u|
  u.sequence(:email) { |n| "lemony#{n}@lemonbag.com" }
  u.password "lemonyssecret"
  u.password_confirmation { |u| u.password }
  u.sequence(:full_name){|n| "lemony lime" }
  u.sequence(:photo_small_url ){|n| "images/id_#{n}" }
  u.sequence(:username ){|n| "lemony_#{n}" }
  u.sequence(:dob) {|n| "15/12/978"}
  u.sequence(:current_location) {|n| "bangalore"}
  u.sequence(:current_geo_lat) {|n| "45.4567"}
  u.sequence(:current_geo_long) {|n| "23.4567"}
  u.sequence(:gender) {|n| "male"}

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
