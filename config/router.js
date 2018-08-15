import React from "react";
import { createStackNavigator } from "react-navigation";

import Pod from "../components/podcast/podcast";
import PodCastList from "../components/podcast/podcastList";



const RootStack = createStackNavigator(
  {
    
    Podcast: {
      screen: Pod,
      navigationOptions: ({ navigation }) => ({
        title: `Episode N° ${navigation.state.params.itemId}`,
        headerStyle: {
          backgroundColor: "#E8B959"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold"
        }
      })
    },
    PodcastList: {
      screen: PodCastList,
      navigationOptions: {
        title: "Episodes 📻",
        headerStyle: {
          backgroundColor: "#E8B959"
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 40,
          textAlign: "center",
          alignSelf: "center",
          flex: 1
        }
      }
    }
  },
  {
    initialRouteName: "PodcastList"
  }
);

export default RootStack
