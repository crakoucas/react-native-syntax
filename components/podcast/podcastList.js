import React, { Component } from "react";
import {
  TouchableHighlight,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet
} from "react-native";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import dateFns from "date-fns";
import Loading from "../loading";
import ErrorComponent from "../error";
import { PermissionsAndroid } from "react-native";

// Graph Ql
const GET_PODCASTS = gql`
  {
    podcasts {
      name
      date
      id
    }
  }
`;

export default class Pod extends Component {
  componentDidMount() {
    this.requestExternalStorage();
  }
  // Request access external storage
  requestExternalStorage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "SyntaxAndroid required Location permission",
          message: "We required Write permission in order to read podcast"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You've access for the READ_EXTERNAL_STORAGE");
      } else {
        console.log("You don't have access READ_EXTERNAL_STORAGE");
      }
    } catch (err) {
      alert(err);
    }
  };

  render() {
    return (
      <Query query={GET_PODCASTS}>
        {({ loading, error, data }) => {
          if (error) return <ErrorComponent />;
          if (loading || !data) return <Loading />;

          return (
            <View style={styles.background}>
              <FlatList
                data={data.podcasts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() =>
                      this.props.navigation.navigate("Podcast", {
                        itemId: item.id,
                        title: item.name
                      })
                    }
                  >
                    <View style={styles.border}>
                      <View style={{ flex: 2, marginLeft: 5, marginRight: 5 }}>
                        <Text
                          style={styles.textLeft}
                        >
                          {dateFns.format(JSON.parse(item.date), "DD/MM/YY")}
                        </Text>
                      </View>
                      <View style={{ flex: 8 }}>
                        <Text
                          style={styles.textCenter}
                        >
                          Episode {item.id}: {item.name}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Image
                          source={require("../../static/play/podcast.png")}
                          style={{ width: 30, height: 30, margin: "auto" }}
                        />
                      </View>
                    </View>
                  </TouchableHighlight>
                )}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgb(55, 57, 61)",
    paddingTop: 20
  },
  border: {
    backgroundColor: "rgba(45, 45, 45, 0.2)",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8B959",
    padding: 8,
    margin: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  textLeft: {
    fontSize: 12,
    color: "pink",
    fontWeight: "bold",
    marginRight: 10
  },textCenter: {
    fontSize: 15,
    color: "#E8B959",
    textAlign: "center"
  }
});
