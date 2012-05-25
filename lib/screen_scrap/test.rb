require 'pismo'
require 'nokogiri'
require 'pp'
require './common.rb'
require './myem.rb'
require 'boilerpipe'

URL ='http://dare.co.in/events/event-reports/a-smashing-time-at-tie-mumbai-smashup.htm'

def run_em
  if !EM.reactor_running?
    Thread.new {
      EM.run {}
    }
    end  
end

run_em

def get_item(params)
  case params[:type]
  when "class"
    return params[:child]["class"]
  when "id"
    return params[:child]["id"]
  when "property"
    return params[:child].attributes["content"]
  when "text"
    return params[:child].text
  end
  return nil
end

def get_node(params)
  item = nil
  params[:node].each do |node|
    params[:child] = node
    item = get_item(params)
    break if item.nil?
  end
  item
end

def get_title(params)
  if !params[:tag].nil?
    params[:node] = params[:document].css(params[:tag])
    title = get_node(params)
  else
    title = params[:document].match(params[:default_tags], false )
  end 
  title
end

def get_descrtiption(params)
  if !params[:tag].nil?
    params[:node] = params[:document].css(params[:tag])
    description = get_node(params)
  else
    description = params[:document].match(params[:default_tags], false )
  end 
  description
end

def get_favicon(params)
  if !params[:tag].nil?
    params[:node] = params[:document].css(params[:tag])
    favicon = get_node(params)
  else
    favicon = params[:document].match(params[:default_tags], false )
  end 
  favicon
end


def get_author(params)
  if !params[:tag].nil?
    params[:node] = params[:document].css(params[:tag])
    author = get_node(params)
  else
    author = params[:document].match(params[:default_tags], false )
  end 
  author
end

def get_image(params)
  if !params[:tag].nil?
    params[:node] = params[:document].css(params[:tag])
    image = get_node(params)
  else
    image = params[:document].match(params[:default_tags], false )
  end
end

def get_thumbnail
end

#deserialize lambdas and proc stored in yaml
def dserialize_tags(tags)
 
  tags.each do |attr|
    if attr.class == Array
      attr.each_with_index do |elem, index|
        if elem =~ /^lambda|^Proc/
          attr[index] =eval(elem)
        end
      end
    end
  end
end

def process_url

end
def func

  response = MyHttp.request([{:url => URL, :params => {:redirects => 3}, :method => "get", :handle =>URL}]) 

  doc = Nokogiri::HTML(response[0][:response])

  tags =  YAML.load_file("./tags.yml")
  title = doc.match( tags['title'], true )

  uri = response[0][:request].uri

  puts uri.to_s
  uri=uri.to_s.gsub(/:\d+/,"")

  puts uri
  puts "title => #{title}"

  author = doc.match( tags['author'], true )

  puts "author => #{author}"

  favicon = doc.match(  dserialize_tags(tags['favicon']), true )

  puts "favicon=> #{favicon}"

  description = doc.match( tags['description'], true )

  puts "description => #{description}"

  image = doc.match(dserialize_tags(tags['image']), true )

  puts "image => #{image}"

  get_image({:document => doc, :default_tags => dserialize_tags(tags['image'])})

  doc = Boilerpipe.extract(URL, {:output => :json})

  puts "======================"
  puts doc.inspect 
end


if __FILE__ == $0
  while true
    out = STDIN.readline
    out = out.gsub(/\n/,"")
    run_em
    EM.next_tick {
      Fiber.new { 
        func
      }.resume
    }
    puts "Em Done"
    pp "Command Line" + Thread.current.inspect
  end
end
