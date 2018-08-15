import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ReactMarkdown from "react-native-simple-markdown";
import { markdownStyles } from "../../../config/style";

const ViewMarkdown = ( {data} ) => {
  return (
    <View style={styles.readme}>
      <ScrollView style={{ padding: 5, marginTop: 10, marginBottom: 20 }}>
        <ReactMarkdown styles={markdownStyles}>{data}</ReactMarkdown>
      </ScrollView>
      <View style={{ padding: 5, marginTop: 10, marginBottom: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  readme: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(55, 57, 61)",
    padding: 5
  }
});

export default ViewMarkdown;
