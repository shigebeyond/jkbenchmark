#!/bin/sh
JAVA_VERSION=`java -fullversion 2>&1 | awk -F[\"\.] '{print $2$3$4}' |awk -F"_" '{print $1}'`
if [ $JAVA_VERSION -lt 180 ]; then
	echo "Error: Java version should >= 1.8.0 "
    exit 1
fi

cd `dirname $0`
DIR=`pwd`

PRO="jkbenchmark-web-1.9.0"
if [ ! -d $PRO ]; then
	mkdir $PRO
	cd $PRO
	war=$PRO".war"
	echo "解押"$war
	unzip ../$war
fi
cd $DIR

sed -i "s/jkbenchmark-web\/src\/main\/webapp/'$PRO'/g" $PRO/WEB-INF/classes/jetty.yaml

echo "启动jetty"
JAVA_OPTS="-Djava.net.preferIPv4Stack=true -server -Xms1g -Xmx1g -XX:MetaspaceSize=128m -Djava.util.concurrent.ForkJoinPool.common.parallelism=32"

JAVA_DEBUG_OPTS=""
if [ "$1" = "debug" ]; then
    JAVA_DEBUG_OPTS=" -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=5005,server=y,suspend=n "
fi

SERVER_CLASS='net.jkcode.jkmvc.server.JettyServerLauncher'

java $JAVA_OPTS $JAVA_DEBUG_OPTS -cp $DIR/$PRO/WEB-INF/classes:$DIR/$PRO/WEB-INF/lib/* $SERVER_CLASS