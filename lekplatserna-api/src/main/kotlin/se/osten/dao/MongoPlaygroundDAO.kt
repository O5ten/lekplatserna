package se.osten.dao

import org.litote.kmongo.*
import se.osten.api.DAO
import se.osten.beans.DatabaseConnection
import se.osten.beans.Playground
import se.osten.utils.byId

class MongoPlaygroundDAO(val dbConn: DatabaseConnection, collectionName: String = "playground") : DAO<Playground> {

    val entities = dbConn.database.getCollection<Playground>(collectionName)

    override fun count(): Long {
        return entities.count()
    }

    override fun findAll(): List<Playground> {
        return entities.find().toList()
    }

    override fun save(playground: Playground) {
        entities.insertOne(playground)
    }

    override fun findById(id: String): Playground? {
        return entities.findOne(byId(id))
    }

    override fun findByName(name: String): Playground? {
        return entities.findOne("{path: {\$eq: $name}}")
    }

    override fun update(id: String, entity: Playground) {
        entities.findOneAndReplace(byId(id), entity)
    }

    override fun delete(id: String) {
        entities.deleteOne(byId(id))
    }
}

