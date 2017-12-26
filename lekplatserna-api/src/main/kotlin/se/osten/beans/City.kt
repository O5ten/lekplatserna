package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class City(
        @SerializedName("label") val label: String = "",
        @SerializedName("value") val value: String = "",
        @SerializedName("lat") val lat: Double = 0.0,
        @SerializedName("lon") val lng: Double = 0.0
) : Serializable