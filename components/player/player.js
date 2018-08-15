import React, { Component } from "react";
import {
  View,
  Text,
  Slider,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import { AsyncStorage } from "react-native";
import Sound from "react-native-sound";
//
import PlayButton from "./playButton";
import PauseButton from "./pauseButton";
import ForwardButton from "./forwardButton";
import RewindButton from "./rewindButton";
import BigPlayButton from "./bigPlayButton";

class Player extends Component {
  state = {
    playState: "idle", //playing, paused, idle
    playSeconds: 0,
    duration: 0,
    speed: 1,
    animEnd: false,
    fadeAnim: new Animated.Value(0)
  };
  componentDidMount() {
    Animated.timing(
      // Uses easing functions
      this.state.fadeAnim, // The value to drive
      {
        toValue: 1,
        duration: 650,
        easing: Easing.bounce,
        useNativeDriver: true
      }
    ).start();

    this.timeout = setInterval(() => {
      if (this.sound && this.state.playState == "playing") {
        this.sound.getCurrentTime((seconds, isPlaying) => {
          this.setState({ playSeconds: seconds });
        });
      }
    }, 100);
  }
  componentWillMount() {
    this._retrieveData(this.props.data);
  }
  componentWillUnmount() {
    if (this.sound) {
      this.props.save(this.state.playSeconds, this.sound.getDuration());
      this.sound.release();
    }
  }
  _retrieveData = async podcast => {
    await AsyncStorage.getItem(podcast.toString(), (err, result) => {
      if (err) {
        console.log(err);
      } else if (result == null) {
        console.log("no result");
      } else {
        this.setState({
          playSeconds: JSON.parse(result).playSeconds,
          duration: JSON.parse(result).duration
        });
      }
    });
  };
  play = () => {
    const filepath = this.props.data;
    if (this.state.playState === "playing") {
      return null;
    } else if (
      this.state.playState === "paused" &&
      this.state.playSeconds !== 0
    ) {
      this.sound.play();
      this.setState({ playState: "playing" });
    } else {
      this.sound = new Sound(
        "/storage/emulated/0/Music/Syntax/" + `Syntax${filepath}.mp3`,
        null,
        error => {
          if (error) {
            console.log("failed to load the sound", error);
            Alert.alert("Notice", "audio file error. (Error code : 1)");
            this.setState({ playState: "paused" });
          } else if (this.state.playSeconds !== 0) {
            this.sound.setCurrentTime(this.state.playSeconds);
            this.setState({
              playState: "playing"
            });
            this.sound.play(this.playComplete);
          } else {
            this.setState({
              playState: "playing",
              duration: this.sound.getDuration()
            });
            this.sound.play(this.playComplete);
          }
        }
      );
    }
  };
  pause = () => {
    if (this.sound) {
      if (this.state.playState === "playing") {
        this.sound.pause();
        this.props.save(this.state.playSeconds, this.sound.getDuration());
        this.setState({ playState: "paused" });
      }
    }
  };
  forward = () => {
    if (this.sound) {
      this.sound.getCurrentTime(time => this.sound.setCurrentTime(time + 10));
    }
  };
  rewind = () => {
    if (this.sound) {
      this.sound.getCurrentTime(time => this.sound.setCurrentTime(time - 10));
    }
  };
  playSpeed = () => {
    switch (this.state.speed) {
      case 1:
        this.sound.setSpeed(1.25);
        this.setState({ speed: 1.25 });
        break;
      case 1.25:
        this.sound.setSpeed(1.5);
        this.setState({ speed: 1.5 });
        break;
      case 1.5:
        this.sound.setSpeed(2);
        this.setState({ speed: 2 });
        break;
      case 2.0:
        this.sound.setSpeed(1);
        this.setState({ speed: 1 });
        break;
      default:
        this.sound.setSpeed(1);
        this.setState({ speed: 1 });
        break;
    }
  };
  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s)
    );
  }
  onSliderEditing = value => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      this.setState({ playSeconds: value });
    }
  };
  render() {
    const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 2 }}>
          <Image
            source={require("../../static/png/logo.png")}
            style={styles.logo}
          />
        </View>
        <Animated.View
          style={{
            flex: 2,
            marginTop: -50,
            opacity: this.state.fadeAnim, // Binds directly
            transform: [
              {
                translateY: this.state.fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0] // 0 : 150, 0.5 : 75, 1 : 0
                })
              }
            ]
          }}
        >
          <View>
            <Text style={styles.time}>{currentTimeString}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <RewindButton rewind={this.rewind} />
              <Slider
                onValueChange={this.onSliderEditing}
                value={this.state.playSeconds}
                maximumValue={this.state.duration}
                maximumTrackTintColor="gray"
                minimumTrackTintColor="#E8B959"
                thumbTintColor="#E8B959"
                style={{
                  alignSelf: "center",
                  width: 250
                }}
              />
              <ForwardButton forward={this.forward} />
            </View>
            <View
              style={styles.bigPlay}
            >
              {this.state.playState === "playing" ? (
                <View
                  style={styles.play}
                >
                  <PlayButton
                    playSpeed={this.playSpeed}
                    speed={this.state.speed}
                  />
                  <PauseButton pause={this.pause} />
                </View>
              ) : (
                <BigPlayButton play={this.play} />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  logo: {
    width: 250,
    height: 250,
    backgroundColor: "rgba(55, 57, 61, 0.5)"
  },
  time: {
    color: "white",
    alignSelf: "center",
    fontSize: 55,
    fontWeight: "bold",
    marginBottom: 30,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textShadowColor: "#E8B959"
  },
  play:{
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20
  },
  bigPlay:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    marginTop: 15
  }
});

export default Player;
