package se.osten.dao

import com.mongodb.client.AggregateIterable
import org.litote.kmongo.MongoOperator.*
import org.litote.kmongo.aggregate
import org.litote.kmongo.formatJson
import org.litote.kmongo.toList
import se.osten.api.View
import se.osten.beans.DatabaseConnection
import se.osten.beans.Tag

class MongoTagView(dbConn: DatabaseConnection) : View<Tag> {
    val onTag = "\$tags"
    val tags: AggregateIterable<Tag> = dbConn.database
            .getCollection("playground")
            .aggregate<Tag>("""[
                    {
                        $unwind : "$onTag"
                    },
                    {
                        $group: {
                            _id : "$onTag",
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort : {
                            count : -1
                        }
                    }
            ]""".formatJson())

    override fun findAll(): List<Tag> {
        return tags.toList()
    }

    override fun findByName(name: String): Tag? {
        return tags.find { it._id.equals(name) }
    }
}

