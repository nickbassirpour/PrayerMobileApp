import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import React from "react";
import { ORGANIC_SOCIETY_LIST } from "../data/constants";
import {
  useFonts,
  Bitter_400Regular,
  Bitter_700Bold,
} from "@expo-google-fonts/bitter";

const OrganicSociety = () => {
  let [fontsLoaded, fontError] = useFonts({
    Bitter_400Regular,
    Bitter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.listTitle}>
        <Text style={styles.listTitleText}>Organic Society</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.flatListContainer}
      >
        <FlatList
          data={ORGANIC_SOCIETY_LIST}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.item} />
              <View style={styles.textStyling}>
                <Text style={styles.text}>{item.title}</Text>
                <Text style={styles.textCount}>14 Articles</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default OrganicSociety;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 5,
  },
  flatListContainer: {
    marginTop: 2,
    flex: 1,
    paddingVertical: 2,
    paddingLeft: 10,
  },
  listTitle: {
    paddingLeft: 10,
  },
  listTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Bitter_700Bold",
  },
  row: {
    flexDirection: "row",
    marginRight: 10,
    height: 60,
    width: 300,
  },
  item: {
    width: 50,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "gray",
    alignContent: "center",
  },
  text: {
    fontFamily: "Bitter_400Regular",
  },
  textStyling: {
    justifyContent: "center",
    paddingLeft: 5,
  },
  textCount: {
    fontFamily: "Bitter_400Regular",
    fontSize: 10,
  },
});
