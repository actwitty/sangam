module Test
  class << self

    def test_get_stream(user)
#
      puts "Normal Stream"
      s = user.get_stream({:user_id => user.id})
      puts s
#
#      puts "Normal Till"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc })
#      puts s
#
#      puts "Normal Since"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :since => Time.now.utc })
#      puts s
#
#      puts "Normal Source"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc, :source_name => "actwitty"})
#      puts s
#
#      puts "Entity All Filter"
#      s = user.get_stream({:user_id => user.id,  :till => Time.now.utc,
#                                     :source_name => "actwitty", :filter => {:entity => {:all => true}}})
#      puts s

#      puts "Entity ID Filter"
#      e = Entity.where(:entity_name => "pizza hut").first
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:entity => {:id => e.id}}})
#      puts s
#
#      puts "Location All Filter"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:location => {:all => true}}})
#      puts s
#
#      puts "Location ID Filter"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:location => {:id => @hub.first.location_id}}})
#      puts s
#
#      puts "Document All Filter"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:document => {:all => true}}})
#      puts s

#      puts "Document ID Filter"
#      s = user.get_stream({:user_id => user.id, :summary_id => @act[:post][:summary_id], :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:document => {:id => @doc.first.id}}})
#      puts s
#
#      puts "Document Type Filter"
#      s = user.get_stream({:user_id => user.id,  :till => Time.now.utc,
#                                            :source_name => "actwitty", :filter => {:document => {:type => "video"}}, :limit => 2})
#      puts s
#      Activity.destroy_all(:id => @act1[:post][:id])
    end


  end
end
