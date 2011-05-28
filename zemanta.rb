require 'net/http'
require 'rubygems'
require 'xmlsimple'

gateway = 'http://api.zemanta.com/services/rest/0.0/'
text = 'reading about Deepika Padukone and Sidharth Mallya'
res = Net::HTTP.post_form(URI.parse(gateway),
                         {
                         'method'=>'zemanta.suggest',
                         'api_key'=> 'koywupp1tipmwuj9nslvyj5f',
                         'text'=> text,
                         'format' => 'xml',
                          'sourcefeed_ids' => 'facebook'
                         })
  puts res

  data = XmlSimple.xml_in(res.body)
  data['keywords'][0]['keyword'].each { |v|
     puts v['name']
  }
