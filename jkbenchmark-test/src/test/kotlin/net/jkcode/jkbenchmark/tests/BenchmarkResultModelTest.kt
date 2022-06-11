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
        val field = "tps"
//        val field = "rt"
        val hasHikari = false

        val actions = BenchmarkResultModel.queryBuilder()
                .selectDistinct("action")
                .where("requests", 100000)
                .findColumn<String>()
        val players = if(hasHikari)
                        arrayOf("jkorm-druid", "jkorm-hikari", "mybatis")
                    else
                        arrayOf("jkorm-druid", "mybatis")
        val str = StringBuilder()
        str.append(" | 测试场景 ")
        for (player in players){
            str.append("| $player $field ")
        }
        val htitle = if(hasHikari) "jkorm-hikari/mybatis |" else ""
        str.appendln(" | 性能排序 | jkorm-druid/mybatis | $htitle 最优 |")
        str.appendln("|--------|-----------|---------|--------------|--------------|--------------|" + if (hasHikari) "--------------|" else "")
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
            val values = ArrayList<Double>()
            for(player in players) {
                val value: Double = player2result[player]!![field]
                str.append("| $value ")
                values.add(value)
            }

            // 排序
            /*
            val orderPlayers = results.map {
                it.player
            }
            str.append("| ").append(orderPlayers.joinToString(" > "))//没有处理相等
            */
            str.append("| ").append(results[0].player)
            for(i in 1 until results.size){
                val player = results[i].player
                var op = " > "
                if(values[i] == values[i-1])
                    op = " = "
                str.append(op).append(player)
            }

            // 比例
            val df = DecimalFormat("0.00")
            var mybatis: Double = player2result["mybatis"]!![field]
            var druid: Double = player2result["jkorm-druid"]!![field]
            str.append("| " + df.format(druid * 100 / mybatis) + " % ")
            if(hasHikari) {
                var hikari: Double = player2result["jkorm-hikari"]!![field]
                str.append("| " + df.format(hikari * 100 / mybatis) + " % ")
            }

            str.append(" | " + results.first().player)

            str.appendln("|")
        }

        println(str)
    }
}