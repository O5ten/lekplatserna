package se.osten.dao

import com.google.gson.Gson
import com.mongodb.client.AggregateIterable
import org.litote.kmongo.MongoOperator.*
import org.litote.kmongo.aggregate
import org.litote.kmongo.formatJson
import org.litote.kmongo.toList
import se.osten.api.View
import se.osten.beans.DatabaseConnection
import se.osten.beans.Tag

class MongoTagView(val dbConn: DatabaseConnection) : View<Tag> {
    val tags = "\$tags"
    val tagView: AggregateIterable<Tag> = dbConn.database
            .getCollection("playground")
            .aggregate<Tag>("""[
                    {
                        $unwind : "$tags"
                    },
                    {
                        $group: {
                            _id : "$tags",
                            count: {
                                $sum: 1
                            }
                        }
                    }
            ]""".formatJson())

    override fun findAll(): List<Tag> {
        return tagView.toList()
    }

    override fun findByName(name: String): Tag? {
        return tagView.toList().find { it._id.equals(name) }
    }
}

