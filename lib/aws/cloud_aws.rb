#This  Class only for enable logging while testing in standalone ruby environments
if !defined? RAILS_ENV
  require 'logger'

  class Rails
    class << self
      @log = nil

      def logger
        if @log.nil?
          @log = Logger.new(STDOUT)
        end
        @log
      end
    end
  end 
end
#################################################################################
#


require 'right_aws'  
require 's3'

module CloudAws
  
  mattr_accessor  :aws_access_key_id
  mattr_accessor  :aws_secret_access_key

  def self.configure
    yield self
  end


  def self.included(base)
  end
  
 
end
