package net.jkcode.jkbenchmark.serializer

import net.jkcode.jkbenchmark.BenchmarkApp
import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.serialize.FstSerializer
import net.jkcode.jkutil.serialize.HessianSerializer
import org.nustaq.serialization.FSTConfiguration


/**
 * 运行命令：
 * 　　　java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.serializer.HessianSerializerPlayer
 */
class HessianSerializerPlayer: SerializerPlayer {

    companion object{

        @JvmStatic
        fun main(args: Array<String>) {
            BenchmarkApp.main(arrayOf(HessianSerializerPlayer::class.qualifiedName!!))
        }
    }

    /**
     * 玩家名
     */
    override val name: String = "hessian"

    /**
     * 序列器
     */
    override val serializer = HessianSerializer()

}