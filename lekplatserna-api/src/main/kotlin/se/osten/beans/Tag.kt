package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Tag(
        @SerializedName("tag") val _id: String = ""
) : Serializable