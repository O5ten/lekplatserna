package se.osten.paths

import com.google.gson.Gson
import khttp.responses.Response
import se.osten.beans.Auth
import se.osten.beans.FacebookOAuthResponse
import se.osten.beans.User
import se.osten.utils.createGuid
import se.osten.utils.log
import spark.Spark.*
import java.nio.charset.Charset
import java.util.concurrent.ConcurrentHashMap

class AuthPath(private val admins: List<User>, private val sessions: ConcurrentHashMap<String, Auth>, private val appSecret: String, private val appId: String) {
    val gson = Gson()
    val oauthTokenResponse = gson.fromJson<FacebookOAuthResponse>(String(khttp.get("https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials").content, Charset.forName("UTF-8")), FacebookOAuthResponse::class.java)
    val oauthTokenParts = oauthTokenResponse.access_token.split("|")
    val oauthToken = oauthTokenParts[0] + "|" + oauthTokenParts[1]
    fun start() {
        println("/api/auth")
        path("/auth") {
            post("" ) { req, res ->
                res.type("application/json")
                var authInfo: Auth = gson.fromJson<Auth>(req.body(), Auth::class.java)
                if(sessions.containsKey(authInfo.session)){
                    log(req, " authorized from session ${authInfo.session} belonging to ${authInfo.email}")
                    res.status(200)
                }else{
                    val facebookResponse = khttp.request(
                            "GET",
                            "https://graph.facebook.com/debug_token",
                            emptyMap<String, String>(),
                            mapOf("input_token" to authInfo.accessToken,
                                        "access_token" to oauthToken,
                                        "grant_type" to "client_credentials")
                    )
                    if (facebookResponse.statusCode == 200) {
                        val role = if (admins.any { it.email.equals(authInfo.email) }) "admin" else "user"
                        authInfo = authInfo.copy(session = createGuid(), role = role)
                        log(req, " Authorized new session ${authInfo.session} belonging to ${authInfo.email}")
                        res.status(201)
                        sessions.put(authInfo.session, authInfo)
                    } else {
                        log(req, " Rejected session ${authInfo.session} belonging to ${authInfo.email}, unable to verify against Facebook API")
                        halt(404, "Not a valid user")
                    }
                }
                gson.toJson(authInfo)
            }
        }
    }
}