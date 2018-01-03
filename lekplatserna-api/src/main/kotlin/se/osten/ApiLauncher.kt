package se.osten

import com.google.common.collect.Lists
import se.osten.beans.Auth
import se.osten.beans.DatabaseConnection
import se.osten.beans.User
import se.osten.dao.MongoPlaygroundDAO
import se.osten.dao.MongoTagView
import se.osten.paths.*
import se.osten.utils.encode64
import spark.Spark.get
import spark.Spark.path
import spark.kotlin.port
import java.io.File
import java.util.*
import java.util.concurrent.ConcurrentHashMap

fun main(args: Array<String>) {

    val properties = Properties();
    val file = File(".api-config");
    val fis = file.inputStream()

    properties.load(fis)
    fis.close()

    val dbConn = DatabaseConnection(properties)
    val admins = properties.getProperty("admin.emails").split(",").map { User(email = it) }
    val sessions = ConcurrentHashMap<String, Auth>()
    val appSecret = properties.getProperty("app.secret").toString()
    val appId = properties.getProperty("app.id").toString()
    port(properties.getProperty("exposePort").toInt())
    Filters(admins, sessions, properties.getProperty("api.allowed.host").toString()).enableAuthentication()

    println("Registering resources:\n================")
    path("/api") {
        get("") { req, res ->
            res.status(200)
            res.body("Lekplatserna API")
        }
        val entityDao = MongoPlaygroundDAO(dbConn, "playground");

        PlaygroundPath(entityDao).start()
        TagPath(MongoTagView(dbConn)).start()
        CityPath().start()
        AuthPath(admins, sessions, appSecret, appId).start()
        ""
    }
    println("================\nLekplatserna API Started at http://localhost:4567/api")
}