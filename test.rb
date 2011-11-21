require 'net/https'
require 'open-uri'
require 'json'
require 'pp'

ALCHEMY_URL="http://access.alchemyapi.com/calls/url/URLGetCategory"
#ALCHEMY_API_KEY="98f6cdf9355987fa6a0100f5704c2bceccc19f4e"
ALCHEMY_API_KEY="19f585889ffdc85973d4bb78754630bd4594fc40" #aloksrivastava78@gmail.com

def post(url,params)
  uri = URI.parse(url)
  req = Net::HTTP::Post.new(uri.path)
  req.set_form_data(params)
  pp uri
  res = Net::HTTP.start(uri.host, uri.port) do |http|
    http.request(req)
  end
  res
end

def categorize(link)
  parameters={'url'=>"#{link}",'apikey'=> ALCHEMY_API_KEY, 'outputMode'=> "json"}
	response= post(ALCHEMY_URL,parameters)
	data=JSON.parse(response.body)   
	pp data
end
#link = "http://timesofindia.indiatimes.com/business/international-business/Benetton-unhate-ad-shows-world-leaders-in-liplock/articleshow/10758805.cms"
link = "http://www.angryanna.com/"
categorize(link)
  

