package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class GraphResponse(
        @SerializedName("data") val data: FacebookResponse
) : Serializable