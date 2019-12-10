package net.jkcode.jkbenchmark.serializer

import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.serialize.ISerializer

/**
 * 序列化的性能测试的玩家
 */
interface SerializerPlayer: IBenchmarkPlayer {

    val serializer: ISerializer

    fun callDefault(i: Int){
        val obj = Man("shi", 12)
        val bytes = serializer.serialize(obj)
        val obj2 = serializer.unserialize(bytes!!)
        if(obj != obj2)
            throw RuntimeException("序列化错误")
    }

    /**
     * 获得同步动作
     */
    override fun getSyncAction(action: String): (Int) -> Any? {
        return when(action){
            "default" -> this::callDefault
            else -> throw Exception("不能识别action配置: " + action)
        }
    }
}