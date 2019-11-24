package net.jkcode.jkbenchmark.tests

import net.jkcode.jkbenchmark.BenchmarkApp
import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.common.randomInt

/**
 * 运行命令：
 * 　　　java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.tests.DemoPlayer
 */
class DemoPlayer: IBenchmarkPlayer{

    companion object{

        @JvmStatic
        fun main(args: Array<String>) {
            BenchmarkApp.main(arrayOf(DemoPlayer::class.qualifiedName!!))
        }
    }

    /**
     * 玩家名
     */
    override val name: String = "demo"

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