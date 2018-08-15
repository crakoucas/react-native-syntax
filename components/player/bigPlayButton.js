import React from "react";
import {TouchableOpacity, Image} from "react-native";

const BigPlayButton = ({ play}) => {
  return (
    <TouchableOpacity
      onPress={play}
      style={{ justifyContent: "center", marginTop: 30 }}
    >
      <Image
        source={require("../../static/play/play.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  );
};

export default BigPlayButton;
