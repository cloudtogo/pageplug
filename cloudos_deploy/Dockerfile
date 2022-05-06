FROM nginx:1.17.9-alpine

COPY ./html /var/www/pageplug

EXPOSE 80

COPY ./templates/nginx-app.conf.template /nginx.conf.template
COPY ./templates/nginx-root.conf.template /nginx-root.conf.template

# This is the script that is used to start Nginx when the Docker container starts
COPY ./start-nginx.sh /start-nginx.sh
CMD ["/start-nginx.sh"]
