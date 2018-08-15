import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Loading = () => {
  return (
    <View style={styles.base}>
      <Image
        source={require("../static/png/logo.png")}
        style={{
          width: 250,
          height: 250,
          backgroundColor: "rgba(55, 57, 61, 0.5)",
          marginTop: "-30%"
        }}
      />
      <Text style={styles.text}>Loading ...</Text>
      <Text style={styles.text2}>
        The server is hosting by free Heroku Plan
      </Text>
      <Text style={styles.text2}>So Be Patient Thanks</Text>
    </View>
  );
};

export default Loading;

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
  },
  text2: {
    color: "#E8B959",
    fontSize: 20
  }
});
