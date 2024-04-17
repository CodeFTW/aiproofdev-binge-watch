class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create
  def create
    auth = request.env['omniauth.auth']
    user = User.find_or_create_by(email: auth.info.email) do |user|
      user.name = auth.info.name
    end
    session[:user_id] = user.id
    redirect_to root_url, notice: 'Logged in successfully!'
  end
end
