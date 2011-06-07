source 'http://rubygems.org'

gem 'rails', '3.0.7'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'mysql2', '0.2.6'


gem 'bundler', '>= 1.0.0'


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

#Uncatagorized
gem 'addressable', '2.2.2', :require => 'addressable/uri'
gem 'json', '1.4.6'
gem 'annotate-models', '1.0.4'


#Search 
gem 'sunspot_rails', '~> 1.2.1'

#File uploading
gem "paperclip", "~> 2.3"

gem 'mini_magick', '3.2'

gem 'jammit', '0.5.4'

gem 'date_validator'

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

end

group :test, :development do
  gem 'factory_girl_rails', :require => false
  gem 'rspec-rails', '>= 2.0.1'
  gem 'capybara'
end

group :test do
  gem 'factory_girl_rails'
  gem 'fixture_builder', '~> 0.2.0'
  gem 'selenium-webdriver', '~> 0.2.0'
  gem 'cucumber-rails'
  gem 'rspec', '>= 2.0.1'
  #gem 'rspec-rails', '>= 2.0.1'
  gem 'rcov'
  gem 'database_cleaner'
  gem 'spork', '0.8.4'
end

