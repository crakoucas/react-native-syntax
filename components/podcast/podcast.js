import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  AsyncStorage
} from "react-native";
import * as Progress from "react-native-progress";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import Swiper from "react-native-swiper";

import RNFS from "react-native-fs";

import Player from "../player/player";
import Loading from "../loading";
import ErrorComponent from "../error";
import ViewDelete from "./view/viewDelete";
import ViewDeleteDisable from "./view/viewDeleteDisable";
import ViewMarkdown from "./view/viewMarkdown";
import ViewTitle from "./view/viewTitle";

const GET_PODCAST = gql`
  query Podcast($id: Int!) {
    podcast(id: $id) {
      id
      text
      name
      resume
      url
    }
  }
`;

export default class Podcast extends Component {
  state = {
    download: false,
    isDownloading: false,
    downloadProgress: 0,
    animEnd: false,
    fadeAnim: new Animated.Value(0)
  };

  componentDidMount() {
    this._retrieveData(this.props.navigation.state.params.itemId);
  }

  // Download Podcast
  downloadPodcast = (url, number) => {
    Animated.timing(
      // Uses easing functions
      this.state.fadeAnim, // The value to drive
      {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      }
    ).start();

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
          download: true,
          isDownloading: false,
          downloadProgress: 0
        });
        this._downloadData();
      })
      .catch(err => {
        console.log("error");
        console.log(err);
      });
  };

  //Delete Podcast
  deletePodcast = () => {
    return RNFS.unlink(
      `${RNFS.DocumentDirectoryPath}/Syntax${
        this.props.navigation.state.params.itemId
      }.mp3`
    )
      .then(() => {
        console.log("FILE DELETED");
        this.setState({ download: false });
        this._removeDownload();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  //Save to Async storage that the file is download
  _downloadData = async () => {
    const podcast = this.props.navigation.state.params.itemId;
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
  //
  _removeDownload = async () => {
    const podcast = this.props.navigation.state.params.itemId;
    try {
      const value = await AsyncStorage.getItem(podcast.toString());
      if (value !== null) {
        const obj = JSON.parse(value);
        AsyncStorage.setItem(
          podcast,
          JSON.stringify({ ...obj, download: false })
        );
      } else {
        //AsyncStorage.setItem(podcast, JSON.stringify(download));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  //
  _retrieveData = async podcast => {
    await AsyncStorage.getItem(podcast.toString(), (err, result) => {
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

  //Check storage for restart podcast
  _storeData = async (playSeconds, duration) => {
    const podcast = this.props.navigation.state.params.itemId;
    let UID_object = {
      playSeconds,
      duration,
      read: false,
      download: true
    };
    try {
      await AsyncStorage.setItem(
        podcast.toString(),
        JSON.stringify(UID_object),
        () => {
          AsyncStorage.mergeItem(
            podcast.toString(),
            JSON.stringify(UID_object)
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Query
        query={GET_PODCAST}
        variables={{ id: this.props.navigation.state.params.itemId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorComponent />;

          return (
            <View style={{ flex: 1, backgroundColor: "rgb(55, 57, 61)" }}>
              <ViewTitle title={this.props.navigation.state.params.title} />
              <Swiper activeDotColor={"#E8B959"}>
                <View style={styles.player}>
                  {this.state.download === false ? (
                    <View style={styles.swiper}>
                      <Image
                        source={require("../../static/png/logo.png")}
                        style={styles.logo}
                      />
                      <View style={styles.swipper}>
                        {this.state.isDownloading === false ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.downloadPodcast(
                                data.podcast.url,
                                this.props.navigation.state.params.itemId
                              )
                            }
                            style={styles.download}
                          >
                            <Text style={styles.downloadText}>
                              Download Podcast
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Animated.View
                            style={{
                              opacity: this.state.fadeAnim, // Binds directly
                              transform: [
                                {
                                  translateX: this.state.fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [450, 0] // 0 : 150, 0.5 : 75, 1 : 0
                                  })
                                }
                              ]
                            }}
                          >
                            <Progress.Circle
                              progress={this.state.downloadProgress}
                              showsText={true}
                              size={100}
                              color={"#E8B959"}
                              borderWidth={1.5}
                            />
                          </Animated.View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <Player
                      data={this.props.navigation.state.params.itemId}
                      save={this._storeData}
                      dir={RNFS.DocumentDirectoryPath}
                    />
                  )}
                </View>
                <ViewMarkdown data={data.podcast.text} />
                {this.state.download === false ? (
                  <ViewDeleteDisable />
                ) : (
                  <ViewDelete deletePodcast={this.deletePodcast} />
                )}
              </Swiper>
            </View>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  swipper: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  player: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(55, 57, 61)"
  },
  logo: {
    marginTop: "-50%",
    width: 250,
    height: 250,
    backgroundColor: "rgba(55, 57, 61, 0.5)"
  },
  download: {
    backgroundColor: "#E8B959",
    width: 250,
    height: 50,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 20
  },
  downloadText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    paddingTop: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    textShadowColor: "rgba(55, 57, 61, 0.5)"
  }
});
