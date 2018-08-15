import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

const ForwardButton = ({forward}) => {
    return(
        <TouchableOpacity
        onPress={forward}
        style={{ justifyContent: "center" }}
      >
        <Image
          source={require("../../static/play/fast-forward-arrow.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    )
}

export default ForwardButton