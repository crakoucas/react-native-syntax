import React, { Component } from "react";
import { View, Image, AsyncStorage, TouchableOpacity } from "react-native";
import SmallDownload from "../../config/download";

export default class Test extends Component {
  state = {
    donwload: false
  };

  componentDidMount() {
    this._retrieveData(this.props.id);
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this._retrieveData(this.props.id);
    });
  }

  downloadFinish = () => {
    this.setState({ download: true });
  };

  _retrieveData = async id => {
    await AsyncStorage.getItem(id.toString(), (err, result) => {
      if (err) {
      } else if (
        JSON.parse(result) !== null &&
        JSON.parse(result).download == true
      ) {
        this.setState({ download: true });
      } else {
        this.setState({ download: false });
      }
    });
  };

  render() {
    return (
      <View>
        {this.state.download ? (
          <Image
            source={require("../../static/play/podcast.png")}
            style={{ width: 30, height: 30, margin: "auto" }}
          />
        ) : (
          <SmallDownload
            number={this.props.id}
            downloadFinish={this.downloadFinish}
            size={30}
          />
        )}
      </View>
    );
  }
}
