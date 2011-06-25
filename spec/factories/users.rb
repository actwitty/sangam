# By using the symbol ':user', we get Factory Girl to simulate the User model.



Factory.define :user do |u|
  u.sequence(:email) { |n| "lemony#{n}@lemonbag.com" }
  u.password "lemonyssecret"
  u.password_confirmation { |u| u.password }
  
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
