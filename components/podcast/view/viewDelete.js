import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Linking
} from "react-native";

const ViewDelete = ({ deletePodcast }) => {
  return (
    <View style={styles.remove}>
      <TouchableOpacity
        onPress={deletePodcast}
        title="Remove"
        color="red"
        accessibilityLabel="Delete Podcast"
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "red"
          }}
        >
          ⛔ Delete Podcast ⛔
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  remove: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(55, 57, 61)"
  }
});

export default ViewDelete
