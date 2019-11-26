package net.jkcode.jkbenchmark.tests

import net.jkcode.jkbenchmark.web.service.BenchmarkResultService
import org.junit.Test

/**
 *
 * @author shijianhang<772910474@qq.com>
 * @date 2019-11-26 6:41 PM
 */
class BenchmarkResultServiceTest {

    @Test
    fun testService(){
        val apps = BenchmarkResultService.getApps()
        println(apps)
        val app = apps.first()
        val fvs = BenchmarkResultService.getFieldValues(app)
        println(fvs)

        val players:List<String> = fvs["player"] as List<String>
        val actions:List<String> = fvs["action"] as List<String>
        val concurrentses: List<Int> = fvs["concurrents"] as List<Int>
        val requestses:List<Int> = fvs["requests"] as List<Int>
        //val asyncs: List<Boolean> = fvs["async"] as List<Boolean>
        var i = 1
        for (player in players)
            for (action in actions)
                for (concurrents in concurrentses)
                    for (requests in requestses) {
                        // 条件字段
                        val where = mapOf(
                                "app" to app,
                                "player" to player,
                                "action" to action,
                                "concurrents" to concurrents,
                                "requests" to requests
                        )
                        // y轴字段
                        val yField = "async"
                        val tvs = BenchmarkResultService.getTrendValues(where, yField)
                        println(tvs)
                    }


    }
}