=begin
require "./cloud_aws"
class SuperAws
  @a = 10
end
class TryAWS < SuperAws
  
  include CloudAws 
  def b
    puts @@aws_access_key_id
    puts @a
  end
end

if __FILE__ == $0
  aws = TryAWS.new
  
  puts aws.b
  aws.create_s3_bucket("TestCloudActwitty")
  aws.list_s3_bucket()
  aws.delete_s3_bucket("TestCloudActwitty_1")
  aws.delete_s3_key("https://s3.amazonaws.com/TestCloudActwitty/test/1_1311917714846_Firefox_wallpaper.png")
  aws.create_s3_key("TestCloudActwitty/test/alok.jpg", "alok.jpg")
end
=end
