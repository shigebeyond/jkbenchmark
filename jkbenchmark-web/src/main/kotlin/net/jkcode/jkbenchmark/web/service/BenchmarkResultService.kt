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
    public fun getApps(): List<String> {
        return BenchmarkResultModel.queryBuilder().distinct().select("app").findColumn<String>()
    }

    /**
     * 获得app下的字段值
     * @return
     */
    private val fields = arrayOf("player", "action", "concurrents", "requests", "async")
    public fun getFieldValues(app: String): Map<String, List<Any>> {
        return fields.associate { field ->
            field to BenchmarkResultModel.queryBuilder().distinct().select(field).where("app", "=", app).findColumn<Any>()
        }
    }

    /**
     * 获得趋势值
     * @param where 条件
     * @param yField y轴字段
     * @return
     */
    private val whereFields = listOf("app", "player", "action", "concurrents", "requests", "async")
    public fun getTrendValues(where: Map<String, Any?>, yField: String): Map<String, Map<String, Any?>> {
        val lackWhereFields = whereFields.subtract(where.keys)
        if(lackWhereFields.isEmpty() || lackWhereFields.size == 1 && lackWhereFields.firstOrNull() == yField){ // 只能有yField可以不在where中
            val rows = BenchmarkResultModel.queryBuilder().wheres(where).select(yField, "tps", "rt", "err_pct").findMaps()
            return rows.associate {
                it[yField].toString() to it
            }
        }

        throw IllegalArgumentException("条件缺少字段: $lackWhereFields")
    }
    
}