# 前端低代码工具（base on AppSmith）

## 🎈 启动项目（windows）
[非windows](/contributions/ClientSetup.md)  
```
// 配置 host
127.0.0.1 dev.appsmith.com

// 环境变量
cp .env.example .env

// 启动本地 nginx docker
cd app/client
yarn start-proxy

// 启动前端服务
yarn 
yarn start-win
```

[服务端指南](/contributions/ServerSetup.md)
```
// .env 环境变量，开发测试 mongo、redis 地址
APPSMITH_MONGODB_URI="mongodb://10.10.13.50:27017/appsmith"
APPSMITH_REDIS_URL="redis://10.10.13.50:63799"

// 使用 IDEA 打开工程
app/server

// 构建 java 服务
mvn clean compile （有依赖更新时执行）
bash ./build.sh -DskipTests

// 启动 java 服务
bash ./scripts/start-dev-server.sh
```

## 📦 打包发布
```
// 前端打包
cd app/client
yarn build-win
docker build -t pageplug-client:demo .
docker tag pageplug-client:demo harbor.cloud2go.cn/cloud2go/pageplug-client:demo
docker push harbor.cloud2go.cn/cloud2go/pageplug-client:demo

// 后端打包
cd app/server
bash ./build.sh -DskipTests
docker build -t pageplug-server:demo .
docker tag pageplug-server:demo harbor.cloud2go.cn/cloud2go/pageplug-server:demo
docker push harbor.cloud2go.cn/cloud2go/pageplug-server:demo

// 重启服务
登录到安装目录下 docker-compose 修改镜像
docker-compose down
docker-compose up -d
```

## 🌱 系统安装脚本
```
install.sh

// 脚本里替换默认镜像地址，安装完成后按需修改项目目录里的 docker-compose.yml 即可
sed -i 's/index\.docker\.io\/appsmith\/appsmith-editor/harbor\.cloud2go\.cn\/cloud2go\/pageplug-client:demo/g' docker-compose.yml.sh
sed -i 's/index\.docker\.io\/appsmith\/appsmith-server/harbor\.cloud2go\.cn\/cloud2go\/pageplug-server:demo/g' docker-compose.yml.sh
```

## 🌼 小程序环境变量
```
// 小程序 ID、密钥，用于获取小程序码
CLOUDOS_WECHAT_APPID=""
CLOUDOS_WECHAT_SECRET=""
```
