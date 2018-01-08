package se.osten.paths

import se.osten.beans.Auth
import se.osten.beans.User
import spark.Spark.before
import spark.Spark.halt

class Filters(private val adminList: List<User>, private val sessions: Map<String, Auth>, private val allowedHost: String) {

    fun enableAuthentication() {
        before("/*") { req, res ->
            val authHeader = req.headers("Authorization")
            if (authHeader != null) {
                //Authentication broken right now
                val session = authHeader.split(" ")[1];
                val auth: Auth? = sessions.get(session)
                if (auth == null || adminList.all { it.email != auth.email }) {
                    halt(401, "You are not a valid user")
                }
            } else if (req.requestMethod().equals("GET") && req.headers("Host").startsWith(allowedHost)) {
                //GET is always allowed from the place this site is running from.
            } else if (req.requestMethod().equals("POST") && req.pathInfo().startsWith("/api/auth") && req.headers("Host").startsWith(allowedHost)){
                //Must start authenticating somewhere
            } else {
                halt(401, "Authorization header missing")
            }
        }
    }
}