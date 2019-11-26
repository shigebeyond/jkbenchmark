package net.jkcode.jkbenchmark.tests

import net.jkcode.jkbenchmark.analyze.BenchmarkResultModel
import net.jkcode.jkutil.common.Config
import org.junit.Test

/**
 *
 * @author shijianhang<772910474@qq.com>
 * @date 2019-11-26 6:41 PM
 */
class BenchmarkResultModelTest {

    @Test
    fun testMakeData(){
        // 构建每个场景的配置
        val allConfig = Config.instance("scenes", "yaml")
        val actions:List<String> = allConfig["action"]!!
        val concurrentses: List<Int> = allConfig["concurrents"]!!
        val requestses:List<Int> = allConfig["requests"]!!
        val asyncs: List<Boolean> = allConfig["async"]!!

        var i = 1
        for (action in actions)
            for (concurrents in concurrentses)
                for (requests in requestses)
                    for (async in asyncs) {
                        val runTime = 100.0 * i++

                        val result = BenchmarkResultModel()
                        result.app = "demo"
                        result.player = "shi"
                        result.action = action
                        result.concurrents = concurrents
                        result.requests = requests
                        result.async = if(async) 1 else 0
                        result.runTime = runTime
                        result.tps = requests / runTime
                        result.rt = runTime / requests
                        result.errPct = i
                        result.create()
                    }

    }
}