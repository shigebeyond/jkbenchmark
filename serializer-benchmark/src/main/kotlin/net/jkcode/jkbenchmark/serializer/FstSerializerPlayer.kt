package net.jkcode.jkbenchmark.serializer

import net.jkcode.jkbenchmark.BenchmarkApp
import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.serialize.FstSerializer
import org.nustaq.serialization.FSTConfiguration

/**
 * 运行命令：
 * 　　　java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.serializer.FstSerializerPlayer
 */
class FstSerializerPlayer: SerializerPlayer{

    companion object{

        @JvmStatic
        fun main(args: Array<String>) {
            BenchmarkApp.main(arrayOf(FstSerializerPlayer::class.qualifiedName!!))
        }
    }

    /**
     * 玩家名
     */
    override val name: String = "fst"

    /**
     * 序列器
     */
    override val serializer = FstSerializer()

    /**
     * 1 单例
     */
    val conf: FSTConfiguration = FSTConfiguration.createDefaultConfiguration()
    fun callSingleton(i: Int){
        callFst(conf)
    }

    /**
     * 2 线程安全
     */
    val confs: ThreadLocal<FSTConfiguration> = ThreadLocal.withInitial {
        FSTConfiguration.createDefaultConfiguration()
    }
    fun callThreadsafe(i: Int){
        callFst(confs.get())
    }

    /**
     * 3 线程安全 + 不共享(不检查循环引用)
     */
    val confs2: ThreadLocal<FSTConfiguration> = ThreadLocal.withInitial {
        val c = FSTConfiguration.createDefaultConfiguration()
        // 默认是true
        c.isShareReferences = false
        c
    }
    fun callUnshared(i: Int){
        callFst(confs2.get())
    }

    /**
     * 调用fst序列化
     */
    fun callFst(conf: FSTConfiguration){
        val obj = Man("shi", 12)
        val bytes = conf.asByteArray(obj)
        val obj2 = conf.getObjectInput(bytes).readObject() as Man
        if(obj != obj2)
            throw RuntimeException("序列化错误")
    }

    /**
     * 获得同步动作
     */
    override fun getSyncAction(action: String): (Int) -> Any? {
        return when(action){
            "default" -> this::callDefault // 调用 jkutil封装好的 FstSerializer, 实现等同于 callUnshared()
            "singleton" -> this::callSingleton
            "threadsafe" -> this::callThreadsafe
            "unshared" -> this::callUnshared
            else -> throw Exception("不能识别action配置: " + action)
        }
    }


}