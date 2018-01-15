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

class PlaygroundPath(private val dao: DAO<Playground>, private val additionalPath: String = "") {

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
        println("/api/playground${additionalPath}")
        path("/playground${additionalPath}") {
            get("/at/:lat/:lon/within/:distance/:unit") { req, res ->
                res.type("application/json")
                val lat = req.params("lat").toDouble()
                val lon = req.params("lon").toDouble()
                val distance = req.params("distance").toDouble()
                val unit = req.params("unit") ?: "m"
                val distanceInMeters = distanceByUnitToMeters(distance, unit)
                val nodesWithinEnvelope = playgroundCache.query(getEnvelopeByCoord(lat, lon, distanceInMeters)) as ArrayList<KdNode>
                val nodesWithinRange = filterNodesOutsideRange(nodesWithinEnvelope,
                        req.params("lat").toDouble(),
                        req.params("lon").toDouble(),
                        distanceInMeters)
                log(req, " ${nodesWithinRange.size} results delivered")
                gson.toJson(nodesWithinRange)
            }
            get("/"){ req, res ->
                res.type("application/json");
                if(req.queryParams("count") != null){
                    log(req, " counted playgrounds " + dao.count())
                    "{\nlength: ${dao.count()}\n}"
                }else{
                    val items = dao.findAll()
                    log(req, " ${items.size} results delivered")
                    gson.toJson(items)
                }
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
                val nearbyPlaygrounds = playgroundCache.query(getEnvelopeByCoord(playground.lat, playground.lon, 100.0)) as ArrayList<KdNode>
                res.type("application/json")
                if(nearbyPlaygrounds.size > 0){
                    log(req, "$id not created because of conflict with ${nearbyPlaygrounds.size} playgroudns")
                    res.status(409)
                    gson.toJson(filterNodesOutsideRange(nearbyPlaygrounds, playground.lat, playground.lon, 100.0))
                }else{
                    dao.save(playground)
                    log(req, "$id created")
                    res.status(201)
                    playgroundCache.insert(Coordinate(playground.lat, playground.lon), playground)
                    gson.toJson(PlaygroundResponse(id, "created"))
                }
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