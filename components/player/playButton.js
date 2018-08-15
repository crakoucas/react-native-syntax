import React from "react";
import { TouchableOpacity, Image, Text} from "react-native"

const PlayButton = ( {playSpeed, speed} ) => {
  return (
    <TouchableOpacity
      onPress={playSpeed}
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
      }}
    >
      <Image
        source={require("../../static/play/play.png")}
        style={{ width: 40, height: 40, marginRight: 8 }}
      />
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          color: "#E8B959"
        }}
      >
        X {speed}
      </Text>
    </TouchableOpacity>
  );
};

export default PlayButton