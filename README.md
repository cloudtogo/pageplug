# 前端低代码工具（base on AppSmith-v1.7.3）

## 🎈 启动项目（windows）

[非 windows](/contributions/ClientSetup.md)

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
yarn start-win ( yarn start-cloudos )
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

## 💕 合并 GitHub 更新

```
// 外网代理
export https_proxy=http://127.0.0.1:3083
export http_proxy=http://127.0.0.1:3083

// 添加 GitHub 远程仓库，定期同步
git remote add mirror https://github.com/appsmithorg/appsmith.git
git fetch mirror master
git checkout master
git merge mirror/master
git push origin master
```

## 📦 打包发布

```
// 前端打包
cd app/client
yarn build-win ( yarn build-cloudos )
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

[cloudtogo外网版本]
// 部署在 k8s 上，由乙麟帮忙管理
docker-registry-idc01-sz.cloudtogo.cn/pageplug-client:cloudtogo
docker-registry-idc01-sz.cloudtogo.cn/pageplug-server:cloudtogo
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
CLOUDOS_WECHAT_APPID="wx414ad0dbeda1a70b"
CLOUDOS_WECHAT_SECRET="d5289fd08b1fb31290f66ea2ce5ec7dc"
```

## 🔔 StarOS 版本注意

```
// StarOS 版本环境变量
// 同步春景 API 列表
CLOUDOS_API_BASE_URL="http://10.10.11.20:8035"
// MOCK API 调用
CLOUDOS_MOCK_BASE_URL="http://10.10.11.20:8899"
// 启动开关
CLOUDOS_IN_CLOUDOS=true

// nginx.conf 配置前端环境变量，替换 index.html 中的配置
sub_filter __PAGEPLUG_CLOUDOS_LOGIN_URL__ 'http://factory.dev.staros.local/user/login';
sub_filter __BMAP_AK__ 'nWCpSjRnXLfGuBc3iLZ9kYv8Y6wYaxf8';
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
StarOS 版本使用固定用户
在开启 inCloudOS 前需要
预先创建该账号

账号：admin@cloudtogo.cn
密码：admin123（当前部署密码）
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
```
