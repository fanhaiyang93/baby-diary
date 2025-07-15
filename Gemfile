source "https://rubygems.org"

# Jekyll版本
gem "jekyll", "~> 3.9.0"

# Jekyll插件
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

# Markdown解析器
gem "kramdown-parser-gfm"

# Windows和JRuby平台支持
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# 性能提升
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# JRuby支持
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]