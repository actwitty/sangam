source 'http://rubygems.org'

gem 'rails', '3.0.7'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'mysql2', '0.2.6'
gem 'foreigner', '0.9.1'

gem 'bundler', '>= 1.0.0'
gem 'chef', '0.9.12', :require => false
gem 'ohai', '0.5.8', :require => false #Chef dependency

gem 'haml', '>= 3.0.25'
gem 'haml-rails', '>= 0.3.4', :group => :development

#Security
gem 'devise',           '~> 1.2.0'
gem 'devise_invitable', '~> 0.4.0'

#Authentication
gem 'omniauth', '0.1.6'

#Views
#gem 'haml', '3.0.25'
gem 'will_paginate', '3.0.pre2'

#Inflected translations
gem 'i18n-inflector-rails', '~> 1.0'

#Tags
gem 'acts-as-taggable-on', :git => 'git://github.com/diaspora/acts-as-taggable-on.git'

#Uncatagorized
gem 'roxml', :git => 'git://github.com/Empact/roxml.git', :ref => '7ea9a9ffd2338aaef5b0'
gem 'addressable', '2.2.2', :require => 'addressable/uri'
gem 'json', '1.4.6'
gem 'http_accept_language', :git => 'git://github.com/iain/http_accept_language.git', :ref => '0b78aa7849fc90cf9e12'
gem 'annotate-models', '1.0.4'

gem 'thin', '1.2.8', :require => false

#Search 
gem 'sunspot_rails', '~> 1.2.1'

#Websocket
gem 'em-websocket', :git => 'git://github.com/igrigorik/em-websocket', :ref => 'e278f5a1c4db60be7485'

#File uploading
gem 'carrierwave', '0.5.2'
gem "fog", '0.3.25'
gem "excon", "0.2.4"
gem 'mini_magick', '3.2'
gem 'aws', '2.3.32' # upgrade to 2.4 breaks 1.8 >.<

gem 'fastercsv', '1.5.4', :require => false
gem 'jammit', '0.5.4'
gem 'rest-client', '1.6.1'
gem 'typhoeus'

gem 'date_validator'
#Backups
gem 'cloudfiles', '1.4.10', :require => false

#Queue
gem 'resque', '1.10.0'
gem 'validates_existence', '>= 0.4'
gem 'default_value_for',  :git => 'git://github.com/FooBarWidget/default_value_for.git'

#generators for gems which dont have it yet
gem  'rails3-generators'

#add validation for foreign keys
gem "validates_existence", ">= 0.4"

#Ancestry gem - a better replacement of act_as_tree
gem 'ancestry'

#Manages constants
gem 'app_constants'

#Manages geo location
gem "geocoder"

group :development do

  gem 'capistrano', '2.5.19', :require => false
  gem 'capistrano-ext', '1.2.1', :require => false
  gem 'sod', :git => "git://github.com/MikeSofaer/sod.git"
  gem "erb2haml"         # Add this line
end

group :test, :development do
  gem 'factory_girl_rails', :require => false
  gem 'rspec-rails', '>= 2.0.1'
  gem 'capybara'
  gem 'launchy'
  gem 'railroady'

end

group :test do
  gem 'factory_girl_rails'
  gem 'fixture_builder', '~> 0.2.0'
  gem 'selenium-webdriver', '~> 0.2.0'
  gem 'capybara'
  gem 'cucumber-rails'
  gem 'rspec', '>= 2.0.1'
  #gem 'rspec-rails', '>= 2.0.1'
  gem 'rcov'
  gem 'database_cleaner'
  gem 'webmock', :require => false
  #gem 'jasmine', :path => 'vendor/gems/jasmine', :require => false
  gem 'rspec-instafail', '>= 0.1.7', :require => false
  gem 'fuubar'
  gem 'spork', '0.8.4'
end

