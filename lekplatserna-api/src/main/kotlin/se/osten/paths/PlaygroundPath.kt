package se.osten.paths

import com.google.gson.Gson
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Envelope
import org.locationtech.jts.index.kdtree.KdNode
import org.locationtech.jts.index.kdtree.KdTree
import se.osten.api.DAO
import se.osten.beans.Playground
import se.osten.beans.PlaygroundResponse
import se.osten.utils.createGuid
import se.osten.utils.distanceByUnitToMeters
import se.osten.utils.getSquareArea
import se.osten.utils.log
import spark.Spark.*

class PlaygroundPath(private val dao: DAO<Playground>) {

    val gson = Gson()
    //https://locationtech.github.io/jts/javadoc/org/locationtech/jts/index/kdtree/KdTree.html
    val playgroundCache = KdTree()

    init {
        dao.findAll().forEach { playground ->
            playgroundCache.insert(
                    Coordinate(playground.lat, playground.lon),
                    playground
            )
        }
    }

    fun start() {
        println("/playground")
        path("/playground") {
            get("/at/:lat/:lon/within/:distance/:unit") { req, res ->
                res.type("application/json")
                val lat = req.params("lat").toDouble()
                val lon = req.params("lon").toDouble()
                val distance = req.params("distance").toDouble()
                val unit = req.params("unit") ?: "m"
                val square = getSquareArea(lat, lon, distanceByUnitToMeters(distance, unit))
                val byLocation = Envelope(square.first, square.second)
                val playgroundsWithinRange = playgroundCache.query(byLocation) as ArrayList<KdNode>
                log(req, " ${playgroundsWithinRange.size} results delivered")
                gson.toJson(playgroundsWithinRange.map { v -> v.data })
            }
            get("/:id") { req, res ->
                res.type("application/json")
                val id = req.params("id")
                val playground: Playground? = dao.findById(id)
                if (playground != null) {
                    log(req, "found")
                    gson.toJson(playground)
                } else {
                    log(req, "not found")
                    res.status(404)
                    gson.toJson(PlaygroundResponse(id, "not found"))
                }
            }

            post("") { req, res ->
                val id: String = createGuid()
                val playground: Playground = gson.fromJson(req.body(), Playground::class.java).copy(id)
                dao.save(playground)
                log(req, " created")
                res.status(201)
                res.type("application/json")
                playgroundCache.insert(Coordinate(playground.lat, playground.lon), playground)
                gson.toJson(PlaygroundResponse(id, "created"))
            }

            put("/:id") { req, res ->
                val id = req.params("id")
                res.type("application/json")
                val sittpuff: Playground = gson.fromJson(req.body(), Playground::class.java)
                log(req, " modified")
                dao.update(id, sittpuff)
                gson.toJson(PlaygroundResponse(id, "modified"))
            }

            delete("/:id") { req, res ->
                val id = req.params("id")
                res.type("application/json")
                log(req, " removed")
                dao.delete(id)
                gson.toJson(PlaygroundResponse(id, "removed"))
            }
        }
    }
}