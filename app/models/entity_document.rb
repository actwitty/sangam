class EntityDocument < ActiveRecord::Base

  belongs_to :entity

  validates_existence_of :entity

  validates_presence_of :entity_doc_name
  validates_length_of   :entity_doc_name, :in => 1..255

  validates_length_of :entity_doc_description, :maximum => 1024, :unless => Proc.new{|a| a.entity_doc_description.nil?}

  validates_format_of :entity_doc_photo_url, :with => URI::regexp(%w(http https))
                                             :unless => Proc.new{|a| a.entity_doc_photo_url.nil?}
  validates_length_of :entity_doc_photo_url, :maximum => 1024,
                                              :unless => Proc.new{|a| a.entity_doc_photo_url.nil?}

  validates_format_of :entity_doc_wiki_url, :with => URI::regexp(%w(http https))
                                             :unless => Proc.new{|a| a.entity_doc_wiki_url.nil?}
  validates_length_of :entity_doc_wiki_url, :maximum => 1024,
                                              :unless => Proc.new{|a| a.entity_doc_wiki_url.nil?}
end
