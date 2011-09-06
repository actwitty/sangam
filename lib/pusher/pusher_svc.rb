require 'em-http'
require 'eventmachine'
require 'pusher'
require 'delayed_job'

module PusherSvc

  
  mattr_accessor  :pusher_app_id
  mattr_accessor  :pusher_key_id
  mattr_accessor  :pusher_secret_key

  def self.configure
    yield self

    Pusher.app_id = self.pusher_app_id
    Pusher.key = self.pusher_key_id
    Pusher.secret = self.pusher_secret_key


    #just for development and test
#    if Rails.env != 'production'
#      if EM.reactor_running?
#        EM.stop
#      end
#      Thread.new { EM.run }
#      puts("\n[LIB] [PUSHER_SVC] [self.configure] Thread count => #{Thread.list.size} ENV => #{Rails.env}")
#
#    end

    Pusher.logger = Rails.logger

  end

  def create_pusher_private_channel(channel_name, socket_id)
    Rails.logger.info("\n[LIB] [PUSHER_SVC] [create_pusher_private_channel] entering => #{channel_name}, #{socket_id} ")

    response = Pusher[channel_name].authenticate(socket_id)

    Rails.logger.info("\n[LIB] [PUSHER_SVC] [create_pusher_private_channel] leaving => #{channel_name}, #{socket_id} ")

  rescue Pusher::Error => e
    Rails.logger.debug("\n[LIB] [PUSHER_SVC] [create_pusher_private_channel] PusherError rescue => #{e.message}")

  rescue  => e
    Rails.logger.debug("\n[LIB] [PUSHER_SVC] [create_pusher_private_channel] RunTimeError rescue => #{e.message}")
  end

  def pusher_event(params)

    Rails.logger.info("\n[LIB] [PUSHER_SVC] [pusher_event] entering => #{params} ")

    #for production on heroku Thin server is running.. That is EM based.
    # On development/test we can use EM as done in
    #self.configure but as of now no need
    if Rails.env != 'production'
      Pusher["private-#{params[:channel]}"].trigger(params[:event], {:some => params[:data]})
    else
      deferrable = Pusher["private-#{params[:channel]}"].trigger_async(params[:event], {:some => params[:data]})
      deferrable.callback {
         Rails.logger.info("\n[LIB] [PUSHER_SVC] [pusher_event] Deferred callback success")
      }

      deferrable.errback {  |e|
         Rails.logger.info("\n[LIB] [PUSHER_SVC] [pusher_event] Deferred Error back failed #{e.message:w}")
      }
    end

    Rails.logger.info("\n[LIB] [PUSHER_SVC] [pusher_event] leaving => #{params} ")

  rescue Pusher::Error => e
  # (Pusher::AuthenticationError, Pusher::HTTPError, or Pusher::Error)
    Rails.logger.debug("\n[LIB] [PUSHER_SVC] [pusher_event] PusherError rescue => #{e.message}")

  rescue  => e
    Rails.logger.debug("\n[LIB] [PUSHER_SVC] [pusher_event] PusherError rescue => #{e.message}")
  end

end
