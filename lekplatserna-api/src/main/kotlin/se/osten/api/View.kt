package se.osten.api

//Readonly aggregate datastructure in db
interface View<T> {
    fun findAll(): List<T>
    fun findByName(name: String): T?
}