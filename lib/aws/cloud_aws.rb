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
