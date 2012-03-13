module JobScheduler  # Run every 30 days and charge a credit card.

  class JobWorker < DJ::Worker

    def run_at
      self.scheduled_time
    end

    def perform
      SocialAggregator.pick_social_aggregation_request(:user_id => self.user_id, :provider => self.provider, :uid => self.uid)
    end

  end
end
