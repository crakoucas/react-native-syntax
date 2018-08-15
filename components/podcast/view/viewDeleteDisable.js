import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking
} from "react-native";

const ViewDeleteDisable = () => {
    return (
      <View style={styles.remove}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "grey"
          }}
        >
          Delete Podcast
        </Text>
       
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

  export default ViewDeleteDisable