package se.osten.paths

import com.google.gson.Gson
import se.osten.api.DAO
import se.osten.api.View
import se.osten.beans.Tag
import spark.Spark.get
import spark.Spark.path


class TagPath(private val dao: View<Tag>) {
    val gson = Gson()
    fun start() {
        println("/api/tag")
        path("/tag") {
            get("") { req, res ->
                res.type("application/json")
                gson.toJson(dao.findAll())
            }
            get("/:name") { req, res ->
                res.type("application/json")
                gson.toJson(dao.findByName(req.params("name")))
            }
        }
    }
}