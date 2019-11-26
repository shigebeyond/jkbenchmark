package net.jkcode.jkbenchmark.web.controller

import net.jkcode.jkbenchmark.web.service.BenchmarkResultService
import net.jkcode.jkmvc.http.controller.Controller

/**
 * 性能测试控制器
 */
class BenchmarkController: Controller() {

    /**
     * 主页
     */
    public fun indexAction() {
        res.sendRedirect("build/")
    }

    /**
     * 获得所有app
     */
    public fun apps(){
        res.renderJson(0, null, BenchmarkResultService.getApps())
    }

    /**
     * 获得app下的字段值
     */
    public fun fieldValues(){
        val app: String = req.getNotNull("app")
        res.renderJson(0, null, BenchmarkResultService.getFieldValues(app))
    }

    /**
     * 获得趋势值
     */
    public fun trendValues(){
        // 全部参数就是where
        val where = HashMap(req.httpParams)
        val yField = where.remove("yField")!!
        res.renderJson(0, null, BenchmarkResultService.getTrendValues(where, yField))
    }

}