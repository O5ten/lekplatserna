package se.osten.utils

import org.litote.kmongo.MongoOperator
import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Envelope
import org.locationtech.jts.index.kdtree.KdNode
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

val EARTH_RADIUS_IN_METRIC_METERS = 6371000;

fun distanceByUnitToMeters(distance: Double, unit: String): Double {
    return when (unit) {
        "m" -> distance
        "km" -> distance * 1000
        "mil" -> distance * 10000
        else -> {
            distance
        }
    }
}

//This should be redone.
fun getEnvelopeByCoord(lat: Double, lon: Double, distanceInMeters: Double ): Envelope{
    val square = getSquareArea(lat, lon, distanceInMeters)
    return Envelope(square.first, square.second)
}

fun filterNodesOutsideRange(nodesWithinRange: ArrayList<KdNode>, lat: Double, lon: Double, distanceInMeters: Double): List<Playground>{
    return nodesWithinRange.map {
        n -> (n.data as Playground)
    }.map {
        p -> p.copy(distance = p2pDistance(lat, lon, p.lat, p.lon))
    }.filter{
        p -> p.distance < distanceInMeters
    }.sortedBy{
        it.distance
    }
}

fun getSquareArea(latitude: Double, londitude: Double, length: Double): Pair<Coordinate, Coordinate> {
    val coefficient: Double = length * 0.0000089;
    val newLatitude: Double = latitude + coefficient;
    val newLonditude: Double = londitude + coefficient / Math.cos(latitude * 0.018);

    val xdiff = newLatitude - latitude;
    val ydiff = newLonditude - londitude;
    return Pair<Coordinate, Coordinate>(
            Coordinate(latitude - xdiff, londitude - ydiff),
            Coordinate(latitude + xdiff, londitude + ydiff)

    )
}

//Haversine formula
fun p2pDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Int {
    val theta1 = Math.toRadians(lat1)
    val theta2 = Math.toRadians(lat2)
    val deltaTheta = Math.toRadians(lat2 - lat1)
    val deltaLambda = Math.toRadians(lon2 - lon1)
    val a = (Math.sin(deltaTheta / 2) * Math.sin(deltaTheta / 2)) +
            (Math.cos(theta1) * Math.cos(theta2) *
                    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2));
    val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (EARTH_RADIUS_IN_METRIC_METERS * c).toInt()
}

val byId = { id: String -> "{id: {${MongoOperator.eq}: '$id'}}" }


