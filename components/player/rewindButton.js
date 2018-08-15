import React from "react";
import { TouchableOpacity, Image } from "react-native";

const RewindButton = ({rewind}) => {
  return (
    <TouchableOpacity
      onPress={rewind}
      style={{ justifyContent: "center" }}
    >
      <Image
        source={require("../../static/play/rewind.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
};

export default RewindButton;
