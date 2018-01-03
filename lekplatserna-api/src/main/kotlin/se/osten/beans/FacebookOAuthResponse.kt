package se.osten.beans

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class FacebookOAuthResponse(
        @SerializedName("access_token") val access_token: String = "",
        @SerializedName("token_type") val token_type: String = ""
) : Serializable

