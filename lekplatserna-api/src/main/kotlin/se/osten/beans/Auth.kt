package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Auth(
        val session: String = "",
        val role: String = "user",
        @SerializedName("name") val name: String = "",
        @SerializedName("email") val email: String = "",
        @SerializedName("accessToken") val accessToken: String = ""
) : Serializable