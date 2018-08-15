import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ViewTitle = ({title}) => {
    return(
        <Text style={styles.title}>
        {title.toUpperCase()}
      </Text>
    )
}

const styles =StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
        color: "#E8B959",
        padding: 8
      }
})
export default ViewTitle