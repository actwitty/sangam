class DocumentsController < ApplicationController
#  def new
#    @u = User.create!(:username => "alok", :password => "abc123", :password_confirmation => "abc123", :email => "ytkoopj@lc.com")
#    @a = Activity.create_activity(:author_id => @u.id, :activity => "eating" , :text => "pizza at pizza hut with @bhaloo @bandar @@ Marathalli",
#                              :location => {:geo_location =>{:geo_latitude => 23.45 ,:geo_longitude => 45.45, :geo_name => "marathalli"}},
#                              :enrich => true)
#    @document = Document.new(:owner_id => @u.id,:activity_id => @a.id, :document_type => "application/pdf")
#  end
#  def create
##    @document = Document.new(params[:document])
#
##    Document.create_document(Integer(params[:document][:owner_id]), Integer(params[:document][:activity_id]),
##                            "#{Rails.root}/tmp#{@document.document_data.to_s}")
#    Document.UploadDocument(Integer(params[:document][:owner_id]), Integer(params[:document][:activity_id]),
#                           params)
#    if 1#@document.save
#      puts "========================"
#      redirect_to(:back)
#
#    else
#      render :action => 'new'
#     end
#
#  end
end
