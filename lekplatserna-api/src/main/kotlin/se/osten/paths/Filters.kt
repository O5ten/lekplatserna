package se.osten.paths

import se.osten.beans.Auth
import se.osten.beans.User
import spark.Request
import spark.Response
import spark.Spark.before
import spark.Spark.halt

class Filters(private val adminList: List<User>, private val sessions: Map<String, Auth>, private val allowedHost: String) {

    val protectedPaths = mapOf(
            "POST" to listOf("/api/playground/:id",
                    "/api/playground/suggestion",
                    "/api/playground/modification"),
            "PUT" to listOf("/api/playground/:id",
                    "/api/playground/suggestion/:id",
                    "/api/playground/modification/:id"),
            "DELETE" to listOf("/api/playground/:id",
                    "/api/playground/suggestion/:id",
                    "/api/playground/modification/:id"),
            "GET" to listOf("/api/playground/",
                    "/api/playground/?count",
                    "/api/playground/suggestion",
                    "/api/playground/modification")
    )

    fun enableAuthentication() {
        before("/*") { req, res ->
            val authHeader = req.headers("Authorization")
            if (authHeader != null) {
                val session = authHeader.split(" ")[1];
                val auth: Auth? = sessions.get(session)
                if (auth == null || adminList.all { it.email != auth.email }) {
                    halt(401, "You are not a valid user")
                }
            } else if (validateRequest(req, res)) {
                //Request is unauthorized, but some paths allow that.
            } else {
                halt(401, "Authorization header missing")
            }
        }
    }

    fun validateRequest(req: Request, res: Response): Boolean {
        val correctOrigin = req.headers("Host").startsWith(allowedHost);
        if (correctOrigin) {
            val protectedPathsByMethod = protectedPaths.get(req.requestMethod())
            if(protectedPathsByMethod != null){
                return !protectedPathsByMethod
                        .map { it.replace(":id", req.params("id") ?: "") }
                        .any { it.equals(req.pathInfo()) }
            }
        }
        return false
    }
}