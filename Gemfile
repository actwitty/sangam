source 'http://rubygems.org'

gem "heroku"

gem 'rails', '3.2.1'

#ALOK need to use 0.8.7 as 0.9 > has DSL errors
gem 'rake'

#gem 'mysql2', '0.2.6'
gem 'pg'

gem 'bundler', '>= 1.0.0'


gem 'haml', '>= 3.0.25'
gem 'haml-rails', '>= 0.3.4', :group => :development

group :assets do
  gem  'compass-rails'
  gem 'compass_twitter_bootstrap'
  gem 'sass-rails', "  ~> 3.2.3"
end
#Security
gem 'devise', '~> 1.2.0'
#gem 'devise_invitable'

#Authentication
#gem 'omniauth', '~> 0.3.2'
gem 'omniauth', '~> 1.0.2'
gem 'omniauth-twitter'
gem 'omniauth-facebook'
gem 'omniauth-linkedin'
gem 'oa-core'
gem 'oauth'

#Inflected translations
gem 'i18n-inflector-rails', '~> 1.0'

#Uncatagorized
gem 'addressable' , '~> 2.2.6'

gem 'json'
gem 'annotate'

gem 'nokogiri'
#File uploading
##gem "fog"
##gem "carrierwave", :git => 'git://github.com/jnicklas/carrierwave.git'
#gem "rmagick"


#gem 'mini_magick', '3.2'

gem 'jammit'

gem 'date_validator'


#generators for gems which dont have it yet
gem 'rails3-generators'

#add validation for foreign keys
gem "validates_existence", ">= 0.4"


gem 'client_side_validations'

#Form Styling
gem 'simple_form' , '1.4.1'

#Manages constants
gem 'app_constants'

#Manages geo location
gem "geocoder"

#Facebook
gem "koala"

#Twitter
gem "twitter"

#Delayed Job
gem 'delayed_job'
gem 'delayed_job_active_record'
gem "dj_remixes"


#easy ARel
gem "squeel" # Last officially released gem

#aws
gem "right_aws"

#for asynchronous web-socket
gem 'em-http-request'

#Facebook meta tags
gem 'meta-tags', :require => 'meta_tags'


#Jquery
gem 'jquery-rails'

#thin
gem 'thin'

group :development do
  #query reviewer
  #gem "query_reviewer", :git => "git://github.com/nesquena/query_reviewer.git"
end

group :test, :development do
  gem 'factory_girl_rails', :require => false
  gem 'rspec-rails', '2.6.1'
  gem 'capybara'
end

group :test do
  gem 'factory_girl_rails'
  gem 'selenium-webdriver', '~> 0.2.0'
  gem 'cucumber-rails'
  gem 'rspec', '>= 2.0.1'
  #gem 'rspec-rails', '>= 2.0.1'
  gem 'simplecov'
  gem 'database_cleaner'
  gem 'spork', '0.8.4'
  #for observer's' test
  gem 'no_peeping_toms'
end

