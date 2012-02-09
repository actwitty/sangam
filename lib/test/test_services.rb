module Test
  class << self
    def test_enable_service(params)
      u = User.where(:id => params[:user_id]).first
      u.enable_service(params)
    end
  end
end