require 'logger'

class Rails
  class << self
    @log = nil

    def logger
      if @log.nil?
        @log = Logger.new(STDOUT)
      end
      @log
    end
  end
end
