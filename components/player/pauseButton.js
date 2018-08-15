import React from 'react'
import { TouchableOpacity, Image } from 'react-native'


const pauseButton = ({pause}) => {
    return (
        <TouchableOpacity
        onPress={pause}
        style={{ justifyContent: "center", marginLeft: 80 }}
      >
        <Image
          source={require("../../static/play/pause-button.png")}
          style={{ width: 40, height: 40 }}
        />
    </TouchableOpacity>
    )
}

export default pauseButton