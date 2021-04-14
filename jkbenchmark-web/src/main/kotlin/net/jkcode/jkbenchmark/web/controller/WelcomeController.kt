package net.jkcode.jkbenchmark.web.controller

import net.jkcode.jkbenchmark.web.service.BenchmarkResultService
import net.jkcode.jkmvc.http.controller.Controller

/**
 * 主页
 */
class WelcomeController: Controller() {

    /**
     * 主页
     */
    public fun index() {
        res.sendRedirect("/index.html")
    }

}