package se.osten

import se.osten.beans.DatabaseConnection
import se.osten.dao.MongoPlaygroundDAO
import se.osten.dao.MongoTagView
import se.osten.paths.CityPath
import se.osten.paths.PlaygroundPath
import se.osten.paths.Filters
import se.osten.paths.TagPath
import se.osten.utils.encode64
import spark.Spark.get
import spark.Spark.path
import spark.kotlin.port
import java.io.File
import java.util.*

fun main(args: Array<String>) {

    val properties = Properties();
    val file = File(".api-config");
    val fis = file.inputStream()

    properties.load(fis)
    fis.close()

    val dbConn = DatabaseConnection(properties)
    val users = properties.getProperty("api.users").split(',').map { encode64(it) }

    port(properties.getProperty("exposePort").toInt())
    Filters(users, properties.getProperty("api.allowed.host").toString()).enableAuthentication()

    println("Registering resources:\n================")
    path("/api"){
        get(""){ req, res ->
            res.status(200)
            res.body("Lekplatserna API")
        }
        val entityDao = MongoPlaygroundDAO(dbConn, "playground");
        PlaygroundPath(entityDao).start()
        TagPath(MongoTagView(dbConn)).start()
        CityPath().start()
        ""
    }
    println("================\nLekplatserna API Started at http://localhost:4567/api")
}