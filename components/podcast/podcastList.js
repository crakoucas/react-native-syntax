import React, { Component } from "react";
import { TouchableHighlight, View, FlatList, StyleSheet } from "react-native";

import gql from "graphql-tag";
import { Query } from "react-apollo";

import Loading from "../loading";
import ErrorComponent from "../error";
import PodList from "./view/podList";

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
  state = {
    podcastDownload: []
  };
  componentDidMount() {}
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
                    <PodList item={item} navigation={this.props.navigation} />
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
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 10
  }
});
