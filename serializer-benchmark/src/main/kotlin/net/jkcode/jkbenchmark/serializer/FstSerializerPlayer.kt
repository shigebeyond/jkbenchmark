package net.jkcode.jkbenchmark.serializer

import net.jkcode.jkbenchmark.BenchmarkApp
import net.jkcode.jkbenchmark.IBenchmarkPlayer
import net.jkcode.jkutil.common.generateId
import org.nustaq.serialization.FSTConfiguration
import java.io.Serializable

data class Man(var name: String, var age: Int): Serializable {
    val id = generateId("man")

    override fun toString(): String {
        return "${javaClass.name}: id=$id, name=$name, age=$age"
    }
}

/**
 * 运行命令：
 * 　　　java net.jkcode.jkbenchmark.BenchmarkApp net.jkcode.jkbenchmark.serializer.FstSerializerPlayer
 */
class FstSerializerPlayer: IBenchmarkPlayer{

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
     * 单例
     */
    val conf: FSTConfiguration = FSTConfiguration.createDefaultConfiguration()
    fun callSingleton(i: Int){
        callFst(conf)
    }

    /**
     * 线程安全
     */
    fun callThreadsafe(i: Int){
        val confs: ThreadLocal<FSTConfiguration> = ThreadLocal.withInitial {
            FSTConfiguration.createDefaultConfiguration()
        }
        callFst(confs.get())
    }

    /**
     * 线程安全 + 不共享(不检查循环引用)
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
            "singleton" -> this::callSingleton
            "threadsafe" -> this::callThreadsafe
            "unshared" -> this::callUnshared
            else -> throw Exception("不能识别action配置: " + action)
        }
    }


}