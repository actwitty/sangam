Thread.abort_on_exception=true
def start_reactor
  if !EM.reactor_running?
    Thread.new {
      Rails.logger.info("[CONFIG] [INITIALIZER] [REACTOR] Reactor running")
      EM.run {
        Rails.logger.flush
      }
    }
  end
end
