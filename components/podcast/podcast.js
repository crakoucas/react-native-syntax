import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated
} from "react-native";
import * as Progress from "react-native-progress";
import { AsyncStorage } from "react-native";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import RNFetchBlob from "rn-fetch-blob";
import Swiper from "react-native-swiper";
import { PermissionsAndroid } from "react-native";

import RNFS from "react-native-fs";

import Player from "../player/player";
import Loading from "../loading";
import ErrorComponent from "../error";
import ViewDelete from "./view/viewDelete";
import  ViewDeleteDisable from "./view/viewDeleteDisable"
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

let dirs = RNFetchBlob.fs.dirs;

export default class Podcast extends Component {
  state = {
    download: false,
    isDownloading: false,
    downloadProgress: 0,
    animEnd: false,
    fadeAnim: new Animated.Value(0)
  };

  componentDidMount() {
    // Check if podcast is download
    RNFS.readDir("/storage/emulated/0/Music/Syntax")
      .then(result => {
        if (
          result.find(
            podcast =>
              podcast.name ===
              `Syntax${this.props.navigation.state.params.itemId}.mp3`
          )
        ) {
          this.setState({ download: true });
        } else {
          this.setState({ download: false });
        }
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
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
    this.setState({ isDownloading: true });
    RNFetchBlob.config({
      path: dirs.MusicDir + "/Syntax" + `/Syntax${number}.mp3`
    })
      .fetch("GET", url)
      .progress((received, total) => {
        this.setState({
          downloadProgress: received / total
        });
      })
      .then(res => {
        this.setState({
          download: true,
          isDownloading: false,
          downloadProgress: 0
        });
      });
  };

  //Delete Podcast
  deletePodcast = () => {
    return RNFS.unlink(
      `/storage/emulated/0/Music/Syntax/Syntax${
        this.props.navigation.state.params.itemId
      }.mp3`
    )
      .then(() => {
        console.log("FILE DELETED");
        this.setState({ download: false });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  //Check storage for restart podcast
  _storeData = async (playSeconds, duration) => {
    const podcast = this.props.navigation.state.params.itemId;
    let UID_object = {
      playSeconds,
      duration,
      read: "fasle"
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

  // Granted Write access before saving podcast
  grantedPodcast = async (url, number) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "SyntaxAndroid required Write permission",
          message: "We required Write permission in order to save podcast"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You've access for the WRITE_EXTERNAL_STORAGE");
        this.downloadPodcast(url, number);
      } else {
        console.log("You don't have access for the WRITE_EXTERNAL_STORAGE");
      }
    } catch (err) {
      alert(err);
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
                              this.grantedPodcast(
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
