
from fabric.api import local

def merge():
    local('git checkout master')
    local('git pull origin master')
    local('git merge origin develop')
    local('git push origin master')


def deploy(server="test")

