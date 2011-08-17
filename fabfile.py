
from __future__ import with_statement
from fabric.api import *


def d():
  env.hosts = ['d.hipsell.com']
  env.key_filename = env.hs_develop_keyfile

def s(): env.hosts = ['s.hipsell.com']

def p(): env.hosts = ['hipsell.com']


def merge():
  branch = local('git symbolic-ref -q HEAD', capture=True).split('/')[-1]

  if branch != 'master':
    local('git checkout master')

  local('git pull origin master')
  local('git merge origin develop')
  local('git push origin master')

  if branch != 'master':
    local('git checkout %s' % branch)


def deploy():
  if 'd.hipsell.com' in env.hosts:
    with cd('/var/hipsell/hs-client'):
      run('echo executed')
      run('echo executed')
      run('git pull origin develop')
      run('sudo restart hs-client')
      run('sleep 0.1')
      run('sudo status hs-client')

  elif 's.hipsell.com' in env.hosts or 'hipsell.com' in env.hosts:

    if 's.hipsell.com' in env.hosts:
      loc = '/data/web/s.hipsell.com/client/'
      proc = 'client-staging'

    elif 'hipsell.com' in env.hosts:
      loc = '/data/web/hipsell.com/client/'
      proc = 'client'

    with cd(loc):
      run('git pull origin master')
      run('sudo supervisorctl restart %s' % proc)

  else:
    raise ValueError('Bad server %s' % server)
