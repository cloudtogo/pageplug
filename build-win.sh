REPOSITORY=harbor.cloud2go.cn/pageplug/$1
DATE_NOW=$(date +%Y%m%d%H%M)
VERSION="${REPOSITORY}:$2_${DATE_NOW}"

docker build --platform linux/amd64 -t ${VERSION} .
docker push ${VERSION}
