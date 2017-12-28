package se.osten.paths

import com.google.common.collect.Lists
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.googlecode.concurrenttrees.radix.ConcurrentRadixTree
import com.googlecode.concurrenttrees.radix.RadixTree
import com.googlecode.concurrenttrees.radix.node.concrete.DefaultCharArrayNodeFactory
import se.osten.beans.City
import se.osten.utils.log
import spark.Spark.get
import spark.Spark.path
import java.nio.charset.Charset

class CityPath() {

    val gson = Gson()
    val rawCitiesString: String = this.javaClass.getResource("cities.json").readText(Charset.forName("UTF-8"));
    val cityType = object : TypeToken<ArrayList<City>>() {}.type
    val citiesList = gson.fromJson<ArrayList<City>>(rawCitiesString, cityType);
    val MINIMUM_QUERY_LENGTH = 2;
    val tree: RadixTree<City> = ConcurrentRadixTree(DefaultCharArrayNodeFactory())

    init {
        citiesList.forEach { city ->
            tree.putIfAbsent(city.label, city.copy());
        }
    }

    fun start() {
        path("/api/city") {
            get("/:id") { req, res ->
                val capitalizedKeyword = req.params(":id").substring(0, 1).toUpperCase() + req.params(":id").substring(1);
                if(capitalizedKeyword.length < MINIMUM_QUERY_LENGTH){
                    "[]"
                }else{
                    res.type("application/json")
                    val cities = tree.getValuesForKeysStartingWith(capitalizedKeyword);
                    log(req, " ${cities.count()} results delivered by keyword $capitalizedKeyword")
                    gson.toJson(Lists.newArrayList(cities))
                }
            }
        }
        println("/city")
    }
}