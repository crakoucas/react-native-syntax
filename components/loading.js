import React from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";

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
      <ActivityIndicator size="large" color="#E8B959" />
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
  }
});
