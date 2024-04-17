Rails.application.config.middleware.use OmniAuth::Builder do
  client_id = Rails.application.credentials.dig(:google, :client_id)
  client_secret = Rails.application.credentials.dig(:google, :client_secret)

  provider :google_oauth2, client_id, client_secret, {
    prompt: 'select_account',
    scope: 'email profile youtube.readonly'
  }

end
OmniAuth.config.allowed_request_methods = %i[get]