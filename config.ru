# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)

use Rack::Static, :urls => ['/uploads'], :root => 'tmp' # adding this line carrierwave patch on heroku to overcome readonly fs of heroku
run Sangam::Application
