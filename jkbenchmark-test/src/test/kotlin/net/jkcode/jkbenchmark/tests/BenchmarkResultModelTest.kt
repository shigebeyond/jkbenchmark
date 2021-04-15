package net.jkcode.jkbenchmark.tests

import net.jkcode.jkbenchmark.analyze.BenchmarkResultModel
import net.jkcode.jkutil.common.Config
import org.junit.Test
import java.text.DecimalFormat
import java.text.MessageFormat


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


    @Test
    fun testFormat(){
        //val field = "tps"
        val field = "rt"

        val actions = BenchmarkResultModel.queryBuilder()
                .selectDistinct("action")
                .where("requests", 100000)
                .findColumn<String>()
        val players = arrayOf("jkorm-druid", "jkorm-hikari", "mybatis")
        val str = StringBuilder()
        str.append(" | 测试场景 ")
        for (player in players){
            str.append("| $player $field ")
        }
        str.appendln(" | 性能排序 | jkorm-druid/mybatis | jkorm-hikari/mybatis | 最优 |")
        str.appendln("|--------|-----------|---------|--------------|--------------|--------------|--------------|--------------|")
        for (action in actions) {
            str.append("| $action ")
            val results = BenchmarkResultModel.queryBuilder()
                    .where("requests", 100000)
                    .where("action", action)
                    .orderBy(field, field == "tps") // tps 升序, rt 降序
                    .findModels<BenchmarkResultModel>()!!

            val player2result = results.associate {
                it.player to it
            }
            for(player in players) {
                val value: Any = player2result[player]!![field]
                str.append("| $value ")
            }

            // 排序
            val orderPlayers = results.map {
                it.player
            }
            str.append("| ").append(orderPlayers.joinToString(" > "))

            // 比例
            var druid: Double = player2result["jkorm-druid"]!![field]
            var hikari: Double = player2result["jkorm-hikari"]!![field]
            var mybatis: Double = player2result["mybatis"]!![field]
            val df = DecimalFormat("0.00")
            str.append("| " + df.format(druid * 100 / mybatis) + " % ")
            str.append("| " + df.format(hikari * 100 / mybatis) + " % ")

            str.append(" | " + results.first().player)

            str.appendln("|")
        }

        println(str)
    }
}