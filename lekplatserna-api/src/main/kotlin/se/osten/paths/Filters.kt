package se.osten.paths

import spark.Spark.*

class Filters(private val users: List<String>) {

    fun enableAuthentication() {
        before("/*") { req, res ->
            val authHeader = req.headers("Authorization")
            if (authHeader != null) {
                val token = authHeader.split(" ")[1];
                if (token !in users) {
                    halt(401, "You are not a valid user")
                }
            } else if (req.headers("Host").startsWith("lekplatserna.se")) {

            } else {
                res.header("WWW-Authenticate", "Basic realm=\"User Visible Realm\"")
                halt(401, "authenticate yourself")
            }
        }
    }
}
