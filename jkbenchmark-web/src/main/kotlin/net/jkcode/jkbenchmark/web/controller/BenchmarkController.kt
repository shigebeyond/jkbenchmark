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
     * http://localhost:8080/jkbenchmark-web/benchmark/apps
     */
    public fun appsAction(){
        res.renderJson(0, null, BenchmarkResultService.getApps())
    }

    /**
     * 获得app下的字段值
     * http://localhost:8080/jkbenchmark-web/benchmark/fieldValues?app=demo
     */
    public fun fieldValuesAction(){
        val app: String = req.getNotNull("app")
        res.renderJson(0, null, BenchmarkResultService.getFieldValues(app))
    }

    /**
     * 获得趋势值
     * http://localhost:8080/jkbenchmark-web/benchmark/trendValues?app=demo&player=shi&action=nth&concurrents=1&requests=100&vsField=async
     */
    public fun trendValuesAction(){
        // 全部参数就是where
        val where = HashMap(req.httpParams)
        val vsField = where.remove("vsField")!!
        val xField = where.remove("xField")!!
        res.renderJson(0, null, BenchmarkResultService.getTrendValues(where, vsField, xField))
    }

}