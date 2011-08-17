
from __future__ import with_statement
from fabric.api import *


def merge():
    local('git checkout master')
    local('git pull origin master')
    local('git merge origin develop')
    local('git push origin master')


def deploy(server='test'):
  if server == 'test':
    with settings(hosts=['d.hipsell.com']):
      with cd('/var/hipsell/hs-client'):
        run('git pull origin develop')
        run('sudo restart hs-client')
        run('sleep 0.1')
        run('sudo status hs-client')

  else if server in ['staging', 's', 'production', 'p']

    if server in ['staging', 's']:
      loc = '/data/web/s.hipsell.com/client/'
      proc = 'client-staging'
      host = 's.hipsell.com'

    else if server in ['production', 'p']:
      loc = '/data/web/hipsell.com/client/'
      proc = 'client'
      host = 'hipsell.com'

    with settings(hosts=[host]):
      with cd(loc):
        run('git pull origin master')
        run('sudo supervisorctl restart %s' % proc)

  else:
    raise ValueError('Bad server %s' % server)
