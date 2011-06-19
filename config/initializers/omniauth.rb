Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook,'224385160907301', 'e9d8c6e5b027fda60b461b25242e88ee',{:scope=>'read_stream,publish_stream,email,user_location,user_likes,user_birthday,user_hometown,user_interests,read_friendlists,publish_checkins'}
  provider :twitter, 'uKJHPO2QTE0lN9M0Rx8ZBw', 'GiI2O31kgBdLgbttxN0ynkzsqH7eKDKY5ISiOBC7Y'
end