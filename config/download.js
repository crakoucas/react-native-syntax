import React, { Component } from "react";
import { View, TouchableOpacity, Image, AsyncStorage } from "react-native";
import RNFS from "react-native-fs";
import * as Progress from "react-native-progress";

export default class SmallDownload extends Component {
  state = {
    isDownloading: false,
    downloadProgress: 0
  };

  download = (url, number) =>
    RNFS.downloadFile({
      fromUrl: url,
      toFile: RNFS.DocumentDirectoryPath + `/Syntax${number}.mp3`,
      connectionTimeout: 1000 * 10,
      background: true,
      discretionary: true,
      progressDivider: 1,
      begin: res => {
        this.setState({ isDownloading: true });
        console.log("Start Download");
      },
      progress: data => {
        const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
        this.setState({
          downloadProgress: percentage
        });
      }
    })
      .promise.then(res => {
        console.log("Download finished.");
        this.setState({
          isDownloading: false,
          downloadProgress: 0
        });
        this._downloadData();
        this.props.downloadFinish();
      })
      .catch(err => {
        console.log("error");
        console.log(err);
        this.setState({ downloadProgress: false });
      });

  _downloadData = async () => {
    const podcast = this.props.number;
    const download = { playSeconds: 0, download: true };
    try {
      const value = await AsyncStorage.getItem(podcast.toString());
      if (value !== null) {
        obj = { ...JSON.parse(value), ...download };
        AsyncStorage.setItem(podcast, JSON.stringify(obj));
      } else {
        AsyncStorage.setItem(podcast, JSON.stringify(download));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.download(
              "https://traffic.libsyn.com/syntax/Syntax066.mp3",
              this.props.number
            );
          }}
        >
          {this.state.isDownloading ? (
            <Progress.Pie
              progress={this.state.downloadProgress}
              size={this.props.size}
              color={"#E8B959"}
            />
          ) : (
            <Image
              source={require("../static/play/down.png")}
              style={{ width: 30, height: 30, margin: "auto" }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
