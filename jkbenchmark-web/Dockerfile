# 先执行 gradle build -x test -Pall, 后执行: sudo docker build -t jkbmweb .; sudo docker run -d -p 8080:8080 --name jkbmweb jkbmweb

# 基础镜像
FROM java

# 描述
MAINTAINER jkbmweb

# 复制文件
# 由于add/copy的文件必须使用上下文目录的内容
COPY build/app/*.war /apps/jkbmweb/
COPY build/app/start-jetty.sh /apps/jkbmweb/
COPY build/app/conf /apps/jkbmweb/conf

# 暴露端口, 跟jetty.yaml端口一样
EXPOSE 8080

# 启动命令, 要一直运行，否则命令结束会导致容器结束
ENTRYPOINT /apps/jkbmweb/start-jetty.sh