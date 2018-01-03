package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class FacebookResponse(
        @SerializedName("app_id") val app_id: Int,
        @SerializedName("id_valid") val is_valid: Boolean
) : Serializable
