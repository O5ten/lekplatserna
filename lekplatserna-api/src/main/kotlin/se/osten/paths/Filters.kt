package se.osten.paths

import spark.Spark.*

class Filters(private val users: List<String>, private val allowedHost: String) {

    fun enableAuthentication() {
        before("/*") { req, res ->
            val authHeader = req.headers("Authorization")
            if (authHeader != null) {
                val token = authHeader.split(" ")[1];
                if (token !in users) {
                    halt(401, "You are not a valid user")
                }
            } else if (req.requestMethod().equals("GET") && req.headers("Host").startsWith(allowedHost)) {

            } else {
                res.header("WWW-Authenticate", "Basic realm=\"User Visible Realm\"")
                halt(401, "authenticate yourself")
            }
        }
    }
}