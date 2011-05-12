# By using the symbol ':user', we get Factory Girl to simulate the User model.



Factory.define :user do |u|
  u.sequence(:username) { |n| "LemonyDummy#{n}" }
  u.sequence(:email) { |n| "lemony#{n}@lemonbag.com" }
  u.password "lemonyssecret"
  u.password_confirmation { |u| u.password }
  
  u.after_build do |user|
      unless user.confirmed_at.nil?
                user.profile = Factory.build(:profile,
                                             :user_id => user.id,
                                             :email => user.email
                                            )
      end
  end
  u.after_create do |user|
     unless user.confirmed_at.nil?
        user.profile.save
     end
  end
end
