import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const ErrorComponent = () => {
  return (
    <View style={styles.base}>
      <Image
        source={require("../static/png/wes400x400.jpg")}
        style={{
          width: 250,
          height: 250,
          backgroundColor: "rgba(55, 57, 61, 0.5)"
        }}
      />
      <Text style={styles.text}>Error My Brow</Text>
    </View>
  );
};

export default ErrorComponent;

const styles = StyleSheet.create({
  base: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(55, 57, 61)"
  },
  text: {
    color: "#E8B959",
    fontSize: 40
  }
});
