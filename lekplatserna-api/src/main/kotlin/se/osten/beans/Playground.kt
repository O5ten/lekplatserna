package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Playground(
        val id: String,
        @SerializedName("distance") val distance: Int = -1, //Calculated value at request-time -1 when not applicable
        @SerializedName("name") val name: String = "",
        @SerializedName("description") val description: String = "",
        @SerializedName("lat") val lat: Double = 0.0,
        @SerializedName("lon") val lon: Double = 0.0,
        @SerializedName("tags") val tags: List<String> = emptyList()
) : Serializable