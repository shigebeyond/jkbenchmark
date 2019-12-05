#!/bin/sh
dir=$(cd $(dirname $0); pwd)
pro="jkbenchmark-web-1.9.0"
if [ ! -d $pro ]; then
	mkdir $pro
	cd $pro
	war=$pro".war"
	echo "解押"$war
	unzip ../$war
fi
cd $dir

sed -i "s/src\/main\/webapp/'$pro'/g" $pro/WEB-INF/classes/jetty.yaml

echo "启动jetty"
JAVA_OPTS="-Djava.net.preferIPv4Stack=true -server -Xms1g -Xmx1g -XX:PermSize=128m -Djava.util.concurrent.ForkJoinPool.common.parallelism=32"

JAVA_DEBUG_OPTS=""
if [ "$1" = "debug" ]; then
    JAVA_DEBUG_OPTS=" -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n "
fi

SERVER_NAME='net.jkcode.jkmvc.server.JettyServerLauncher'

java $JAVA_OPTS $JAVA_DEBUG_OPTS -cp $pro/WEB-INF/classes:$pro/WEB-INF/lib/* $SERVER_NAME