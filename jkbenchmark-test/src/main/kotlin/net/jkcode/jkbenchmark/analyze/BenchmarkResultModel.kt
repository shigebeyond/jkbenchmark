package net.jkcode.jkbenchmark.analyze

import net.jkcode.jkmvc.orm.Orm
import net.jkcode.jkmvc.orm.OrmMeta

/**
 * 性能测试结果
 *
 * @author shijianhang<772910474@qq.com>
 * @date 2019-11-20 21:20:33
 */
class  BenchmarkResultModel(id:Int? = null): Orm(id) {
	// 伴随对象就是元数据
 	companion object m: OrmMeta(BenchmarkResultModel::class, "性能测试结果", "benchmark_result", "id"){}

	// 代理属性读写
	public var id:Int by property() // 结果id 

	public var app:String by property() // 应用名

	public var player:String by property() // 玩家名

	public var action:String by property() // 动作

	public var concurrents:Int by property() // 并发数 

	public var requests:Int by property() // 请求数 

	public var async:Int by property() // 是否异步 

	public var runTime:Double by property() // 运行时间

	public var tps:Double by property() // 吞吐量

	public var rt:Double by property() // 响应时间

	public var errPct:Int by property() // 错误百分比


}