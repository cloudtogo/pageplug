#!/bin/sh
# This script is used to boot Nginx when the Docker container starts
set -ue
cat /nginx.conf.template | envsubst "$(printf '$%s,' $(env | grep -Eo '^PAGEPLUG_[A-Z0-9_]+'))" | sed -e 's|\${\(PAGEPLUG_[A-Z0-9_]*\)}||g' > /etc/nginx/conf.d/default.conf
cat /nginx-root.conf.template | envsubst "$(printf '$%s,' $(env | grep -Eo '^PAGEPLUG_[A-Z0-9_]+'))" | sed -e 's|\${\(PAGEPLUG_[A-Z0-9_]*\)}||g' > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
