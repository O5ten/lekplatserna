package se.osten.api

import se.osten.beans.Playground

interface DAO<T> {
    fun save(playground: T)
    fun findById(id: String): T?
    fun findByName(name: String): T?
    fun findAll(): List<T>
    fun update(id: String, entity: T)
    fun delete(id: String)
    fun count(): Long
}