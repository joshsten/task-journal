# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.precompile += %w( bootstrap.css )
Rails.application.config.assets.precompile += %w( pen.css )
Rails.application.config.assets.precompile += %w( pen.js )
Rails.application.config.assets.precompile += %w( pen.helper.js )
Rails.application.config.assets.precompile += %w( pen.options.js )

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
