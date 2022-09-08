# node
FROM node:14.18-alpine

# mirror
RUN echo 'http://mirrors.aliyun.com/alpine/v3.5/main' > /etc/apk/repositories
RUN echo 'http://mirrors.aliyun.com/alpine/v3.5/community' >>/etc/apk/repositories

# timeZone
RUN apk update && apk add tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

WORKDIR /app
COPY . /app

# npm
RUN yarn config set registry 'https://registry.npm.taobao.org' -g
RUN yarn config set sass_binary_site 'https://npm.taobao.org/mirrors/node-sass/' -g
RUN yarn install --network-timeout 600000
RUN yarn build

RUN yarn add serve

# script
CMD [ "serve", "/app/build" ]
