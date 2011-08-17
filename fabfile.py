
from __future__ import with_statement
from fabric.api import *


def merge():
    local('git checkout master')
    local('git pull origin master')
    local('git merge origin develop')
    local('git push origin master')


def deploy(server='test'):
  if server == 'test':
    with settings(hosts=['d.hipsell.com'])
      with cd('/var/www/hs-client')


  else if server == 'staging' or server == 's':
    loc = '/data/web/s.hipsell.com/client/'

  else if server == 'production' or server == 'p':
    loc = '/data/web/hipsell.com/client/'

  else:
    raise ValueError('Bad server %s' % server)

  with cd(loc):
    run('git pull')
    run(
