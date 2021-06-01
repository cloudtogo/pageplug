cp -uv devhelp/* docker/
echo "=====  【https证书】和【nginx配置文件】准备好了！  ====="
docker rm -f local-nginx || true
MSYS_NO_PATHCONV=1 docker run -d --name local-nginx -p 80:80 -p 443:443 -v `pwd`/docker/nginx-root.conf:/etc/nginx/nginx.conf -v `pwd`/docker/nginx.conf:/etc/nginx/conf.d/app.conf -v `pwd`/docker/_wildcard.appsmith.com.pem:/etc/certificate/dev.appsmith.com.pem -v `pwd`/docker/_wildcard.appsmith.com-key.pem:/etc/certificate/dev.appsmith.com-key.pem nginx:latest
