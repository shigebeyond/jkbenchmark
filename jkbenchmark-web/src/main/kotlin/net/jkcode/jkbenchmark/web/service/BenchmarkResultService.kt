package net.jkcode.jkbenchmark.web.service

import net.jkcode.jkbenchmark.analyze.BenchmarkResultModel

/**
 *
 * @author shijianhang<772910474@qq.com>
 * @date 2019-11-26 12:02 PM
 */
object BenchmarkResultService {

    /**
     * 获得所有app
     * @return
     */
    public fun getApps(): Map<String, List<String>> {
        return BenchmarkResultModel.queryBuilder().distinct().select("app", "player").findMaps().groupBy({ it["app"] as String}, { it["player"] as String})
    }

    /**
     * 获得app下的字段值
     * @return
     */
    private val fields = arrayOf("player", "action", "concurrents", "requests", "async")
    public fun getFieldValues(app: String): Map<String, List<Any>> {
        return fields.associate { field ->
            field to BenchmarkResultModel.queryBuilder().distinct().select(field).where("app", "=", app).orderBy(field).findColumn<Any>()
        }
    }

    /**
     * 获得趋势值
     * @param where 条件
     * @param vsField 对比字段
     * @param xField x轴字段
     * @return 3维对象: 1 对比字段 2 x轴字段 3 tps/rt/err_pct
     */
    private val whereFields = listOf("app", "player", "action", "concurrents", "requests", "async")
    public fun getTrendValues(where: Map<String, Any?>, vsField: String, xField: String): Map<String, Map<String, Map<String, Any?>>> {
        val lackWhereFields = whereFields.subtract(where.keys + vsField + xField)
        if(lackWhereFields.isNotEmpty())
            throw IllegalArgumentException("条件缺少字段: $lackWhereFields")

        val query = BenchmarkResultModel.queryBuilder()
        for((k, v) in where)
            if(k != vsField && k != xField)
                query.where(k, "=", v)
        val rows = query.select(vsField, xField, "tps", "rt", "err_pct").orderBy(vsField).orderBy(xField).findMaps()
        val result = HashMap<String, HashMap<String, Map<String, Any?>>>()
        for(row in rows){
            result.getOrPut(row[vsField].toString()) {
                HashMap()
            }.put(row[xField].toString(), row)
        }

        return result
    }
    
}