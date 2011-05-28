class Users::RegistrationsController < Devise::RegistrationsController
  def create
    #session["#{resource_name}_return_to"] = complete_path
      puts "I AM IN HERE IN CREATE"
      super

  end

  def new
      puts "I AM IN HERE IN NEW"
      super
  end



end
