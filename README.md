# Jkbenchmark

性能测试框架, 提供类库帮助你开发性能测试代码, 提供web图表帮助你分析性能结果

# 开发性能测试代码

## 概念
1. app -- 应用, 表示某个方面的性能测试.

2. player -- 玩家, 表示性能测试的参与方, 可能是多个技术, 如你要对市面上的多个rpc技术进行性能测试, 则每个rpc技术就是一个玩家

3. action -- 动作, 表示要测试的某个行为, 参与测试的多个player都是实现该行为

4. concurrents -- 并发数

5. requests -- 请求数

6. async -- 是否异步

## 开发 Player

```
import net.jkcode.jkbenchmark.BenchmarkApp
import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.common.randomInt

/**
 * 运行命令：
 * 　　　java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.tests.DemoPlayer
 */
class DemoPlayer: IBenchmarkPlayer{

    /**
     * 玩家名
     */
    override val name: String = "shi"

    /**
     * 获得同步动作
     */
    override fun getSyncAction(action: String): (Int) -> Any? {
        return when(action){
            "nth" -> this::doNothing
            else -> throw Exception("不能识别action配置: " + action)
        }
    }

    public fun doNothing(i: Int){
        if(randomInt(5) == 0)
            throw Exception("随机错误")
    }

}
```

## 运行player的性能测试

命令格式:

```
java net.jkcode.jkbenchmark.BenchmarkApp player全类名
```

例子:

```
java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.tests.DemoPlayer
```

# web图表

## 开发环境下的启动

1. 启动后端server
直接启动主类 `net.jkcode.jkmvc.server.JettyServerLauncher`

2. 启动前端server

```
cd jkbenchmark-web/src/main/webui
npm start
```

## 生成环境的启动

1. 编译前端代码
```
cd jkbenchmark-web/src/main/webui
npm run build
```

2. 编译后端代码

```
gradle build -x test -Pall
```

编译后的war文件在: jkbenchmark-web/build/libs/jkbenchmark-web-1.9.0.war

3. 启动http容器

3.1 你可以将 jkbenchmark-web-1.9.0.war 直接扔到 tomcat 的 webapps 中, 直接启动 tomcat 即可

3.2 你也可以使用我写的内嵌jetty来启动

```
cd jkbenchmark-web/build/libs/
./start-web.sh
```

## web界面
开发环境访问 http://localhost:3000/

生成环境访问 http://localhost:8080/

首页

![](img/dashboard.png)

某个app下的所有player

![](img/allplayer.png)

某个app下的单个player

![](img/aplayer.png)

