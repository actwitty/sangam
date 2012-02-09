module Test
  class << self
    def test_get_summary(user)
      s = user.get_summary({:user_id => user.id})
      puts s
      s
    end
  end
end