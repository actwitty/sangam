# encoding: utf-8

class DocumentDataUploader < CarrierWave::Uploader::Base

  include CarrierWave::RMagick
  storage :fog

#  include CarrierWave::Delayed::Job # New

#  ENABLE IT FOR FILE STORAGE. DISABLE THE FOG ABOVE
#  # Choose what kind of storage to use for this uploader:
#  storage :file
#  after :remove, :delete_empty_upstream_dirs
#
#  def delete_empty_upstream_dirs
#    path = ::File.expand_path(store_dir, root)
#    Dir.delete(path) # fails if path not empty dir
#
#   # path = ::File.expand_path(base_store_dir, root)
#   # Dir.delete(path) # fails if path not empty dir
#  rescue SystemCallError
#    true # nothing, the dir is not empty
#  end
  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

#  def cache_dir
#    "#{Rails.root}/tmp/uploads"
#  end


  process :set_content_type

  def set_content_type(*args)
    content_type = file.content_type == 'application/octet-stream' || file.content_type.blank? ?
          MIME::Types.type_for(original_filename).first.to_s : file.content_type
    self.file.instance_variable_set(:@content_type, content_type)

  end


  process :resize_to_fit => [800, 800], :if => :image?

  # Create different versions of your uploaded files:
  version :thumb do

    process :resize_to_fit => [200,200], :if => :image?
    process :doc_create_thumb, :if => :application?

    def full_filename (for_file = model.logo.file)
      s = mime_type(for_file).include?('image') ?  for_file.to_s : mime_type(for_file).split('/')[1] + ".jpg"
      return [version_name,s ].compact.join('_') if !s.nil?
      nil
    end
## To CREATE UNIQUE IMAGES OF DOC TYPE
##    def store_dir
##      #  return "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}" if image?(original_filename)
##      # "#{Rails.root}/public/test"
##    end
  end

  #this just copies the respective icon of doc type to current path
  def doc_create_thumb
    FileUtils.copy("#{Rails.root}/public/test/#{mime_type(original_filename).split('/')[1]}.jpg", current_path)
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
   def extension_white_list
     %w(jpg jpeg png pdf)
   end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  # "something.jpg" if original_filename
  # end

  def method_missing(name, *args)
    return doc?($&.chop) if name.to_s =~ /.*?$/
    super
  end

  protected
    #Need to overcome the self somehow

    def doc?(doc_type)
      self.file.content_type.include?(doc_type)
    end

    def mime_type(file_name)
      return MIME::Types.type_for(file_name.to_s).first.to_s if !file_name.nil?
      nil
    end

 end

