
dep.require 'zz'
dep.provide 'zz.models.User'


zz.models.User.prototype.getAvatarUrl = (size = 60) ->
  "#{this.avatar}?d=mm&s=#{size}"
