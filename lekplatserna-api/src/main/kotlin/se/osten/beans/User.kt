package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable


data class User(
        @SerializedName("name") val name: String = "undisclosed",
        @SerializedName("email") val email: String = "undisclosed"
) : Serializable