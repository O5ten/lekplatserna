package se.osten.paths

import com.google.gson.Gson
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Envelope
import org.locationtech.jts.index.kdtree.KdNode
import org.locationtech.jts.index.kdtree.KdTree
import se.osten.api.DAO
import se.osten.beans.Playground
import se.osten.beans.PlaygroundResponse
import se.osten.utils.*
import spark.Spark.*

class PlaygroundPath(private val dao: DAO<Playground>) {

    val gson = Gson()
    //https://locationtech.github.io/jts/javadoc/org/locationtech/jts/index/kdtree/KdTree.html
    var playgroundCache = KdTree()

    init {
        updatePlaygroundCache()
    }

    fun updatePlaygroundCache() {
        playgroundCache = KdTree()
        dao.findAll().forEach { playground ->
            playgroundCache.insert(
                    Coordinate(playground.lat, playground.lon),
                    playground
            )
        }
    }

    fun start() {
        println("/api/playground")
        path("/playground") {
            get("/at/:lat/:lon/within/:distance/:unit") { req, res ->
                res.type("application/json")
                val lat = req.params("lat").toDouble()
                val lon = req.params("lon").toDouble()
                val distance = req.params("distance").toDouble()
                val unit = req.params("unit") ?: "m"
                val square = getSquareArea(lat, lon, distanceByUnitToMeters(distance, unit))
                val byLocation = Envelope(square.first, square.second)
                val nodesWithinRange = playgroundCache.query(byLocation) as ArrayList<KdNode>
                log(req, " ${nodesWithinRange.size} results delivered")
                val sortedPlaygrounds = nodesWithinRange.map {
                    n -> (n.data as Playground)
                }.map {
                    p -> p.copy(distance = p2pDistance(
                        req.params("lat").toDouble(),
                        req.params("lon").toDouble(),
                        p.lat, p.lon))
                }.sortedBy { it.distance }
                gson.toJson(sortedPlaygrounds)
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
                log(req, "$id created")
                res.status(201)
                res.type("application/json")
                dao.save(playground)
                playgroundCache.insert(Coordinate(playground.lat, playground.lon), playground)
                gson.toJson(PlaygroundResponse(id, "created"))
            }

            put("/:id") { req, res ->
                val id = req.params("id")
                res.type("application/json")
                val playground: Playground = gson.fromJson(req.body(), Playground::class.java).copy(id = id)
                log(req, " modified")
                dao.update(id, playground)
                updatePlaygroundCache()
                gson.toJson(PlaygroundResponse(id, "modified"))
            }

            delete("/:id") { req, res ->
                val id = req.params("id")
                res.type("application/json")
                log(req, " removed")
                dao.delete(id)
                updatePlaygroundCache()
                gson.toJson(PlaygroundResponse(id, "removed"))
            }
        }
    }
}