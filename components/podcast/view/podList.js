import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import dateFns from "date-fns";

import Test from "../test";

export default class PodList extends Component {
  state = {
    download: false,
    isDownloading: false,
    downloadProgress: 0
  };

  render() {
    return (
      <View style={styles.border}>
        <View
          style={{
            flex: 2,
            marginLeft: 5,
            marginRight: 5
          }}
        >
          <Text style={styles.textLeft}>
            {dateFns.format(JSON.parse(this.props.item.date), "DD/MM")}
          </Text>
        </View>
        <View style={{ flex: 8 }}>
          <Text style={styles.textCenter}>
            Episode {this.props.item.id}: {this.props.item.name}
          </Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Test id={this.props.item.id} navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: "rgb(234, 234, 234)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#eaeaea",
    padding: 8,
    minHeight: 50,
    margin: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  textLeft: {
    fontSize: 18,
    color: "rgb(55, 57, 61)",
    marginRight: 10,
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: "#E8B959"
  },
  textCenter: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: "#E8B959"
  }
});
