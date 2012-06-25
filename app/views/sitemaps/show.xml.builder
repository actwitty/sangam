base_url = "http://#{request.host_with_port}"
xml.instruct! :xml, :version=>'1.0'
xml.tag! 'urlset', 'xmlns' => 'http://www.sitemaps.org/schemas/sitemap/0.9' do
  @users.each do |user|
    xml.url {
      xml.loc("http://www.actwitty.com/#{user.username}")
      xml.changefreq("daily")
    }
  end
  @other_routes.each do |other_routes|
    xml.url {
      xml.loc("http://www.actwitty.com/#{other_routes}")
      xml.changefreq("daily")
    }
  end
end
