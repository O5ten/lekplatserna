package se.osten.utils

import org.litote.kmongo.MongoOperator
import org.locationtech.jts.geom.Coordinate
import se.osten.beans.Playground
import spark.Request
import java.nio.charset.Charset
import java.text.SimpleDateFormat
import java.util.*

val bitsOf32: IntRange = 0..31
val dashes = listOf<Int>(8, 13, 18, 23, 32)

fun createGuid(): String {
    val rnd = Random(System.currentTimeMillis())
    val range: List<Int> = bitsOf32.map { rnd.nextInt(16) }
    return range.mapIndexed { v, i -> intToHex(v, i) }.joinToString("");
}

fun filterByTag(req: Request, playgrounds: List<Playground>): List<Playground> {
    val tags = req.queryParams("tags")?.split(",")?.map { v -> v.toLowerCase().trim() }
    return if (tags != null) return playgrounds.filter { v ->
        v.tags.map { t -> t.toLowerCase().trim() }.any { t ->
            t in tags
        }
    } else playgrounds
}

fun intToHex(index: Int, key: Int): String {
    if (index in dashes) {
        return "-"
    }
    return when (key) {
        10 -> "a"
        11 -> "b"
        12 -> "c"
        13 -> "d"
        14 -> "e"
        15 -> "f"
        else -> key.toString()
    }
}

val formatter = SimpleDateFormat("HH:mm:ss")
fun log(req: Request, event: String = "") {
    println("API ${formatter.format(Date())} : ${req.ip()} ${req.requestMethod()} ${req.pathInfo()}/$event")
}

fun encode64(string: String): String {
    return String(Base64.getEncoder().encode(string.toByteArray(Charset.defaultCharset())))
}

fun toHashMap(playground: Playground): HashMap<String, Any> {
    return hashMapOf<String, Any>(
            "id" to playground.id,
            "name" to playground.name,
            "tags" to playground.tags.joinToString(",")
    )
}

val EARTH_X_AXIS_RAND_LENGTH_IN_METRIC_METERS = 12714000
val EARTH_Y_AXIS_RAND_LENGTH_IN_METRIC_METERS = 12757000
val EARTH_RADIUS_IN_METRIC_METERS = 6371000;

fun distanceByUnitToMeters(distance: Double, unit: String): Double{
    return when (unit) {
        "m" -> distance
        "km" -> distance * 1000
        "mil" -> distance * 10000
        else -> {
            distance
        }
    }
}

fun getSquareArea(x: Double, y: Double, length: Double): Pair<Coordinate, Coordinate>{
    val latitudeInRadians = 2*(x/360)*Math.PI
    val longitudeInRadians = 2*(y/360)*Math.PI

    val localEarthRadiusX = Math.cos(latitudeInRadians) * EARTH_RADIUS_IN_METRIC_METERS
    val localEarthRadiusY = Math.sin(longitudeInRadians) * EARTH_RADIUS_IN_METRIC_METERS
    val localRandLengthX = 2 * Math.PI * localEarthRadiusX
    val localRandLengthY = 2 * Math.PI * localEarthRadiusY
    val xdiff = (length / localRandLengthX) * 180
    val ydiff = (length / localRandLengthY) * 180
    return Pair<Coordinate, Coordinate>(
            Coordinate(x - xdiff, y - ydiff),
            Coordinate(x + xdiff, y + ydiff)
    )
}

val byId = { id: String -> "{id: {${MongoOperator.eq}: '$id'}}" }


