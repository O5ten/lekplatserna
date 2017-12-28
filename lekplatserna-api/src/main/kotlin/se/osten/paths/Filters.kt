package se.osten.paths

import spark.Spark.before
import spark.Spark.halt

class Filters(private val users: List<String>, private val env: String) {

    fun enableAuthentication() {
        before("/*") { req, res ->
            val authHeader = req.headers("Authorization")
            if (!req.requestMethod().equals("GET") || !env.equals("dev")) {
                if (authHeader != null) {
                    val token = authHeader.split(" ")[1];
                    if (token !in users) {
                        halt(401, "You are not a valid user")
                    }
                } else {
                    res.header("WWW-Authenticate", "Basic realm=\"User Visible Realm\"")
                    halt(401, "authenticate yourself")
                }
            }
        }
    }
}
