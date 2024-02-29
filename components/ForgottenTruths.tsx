import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TRUTHS_LIST } from "../data/constants";
import {
  useFonts,
  Bitter_400Regular,
  Bitter_700Bold,
} from "@expo-google-fonts/bitter";

const ForgottenTruths = () => {
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
        <View style={styles.listTitleView}>
          <Text style={styles.listTitleText}>Forgotten Truths</Text>
        </View>
        <View style={styles.viewAllView}>
          <Text style={styles.viewAll}>View All</Text>
        </View>
      </View>
      <FlatList
        style={styles.prayerList}
        data={TRUTHS_LIST}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.prayerCardView}>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerCardTitle}></Text>
            </View>
            <View style={styles.prayerCardText}>
              <Text style={styles.prayerCardTitle}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ForgottenTruths;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginVertical: 5,
  },
  listTitle: {
    paddingLeft: 10,
    flexDirection: "row",
  },
  listTitleView: {
    flex: 1,
  },
  listTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Bitter_700Bold",
  },
  viewAllView: {
    alignItems: "flex-end",
    marginRight: 10,
    borderWidth: 1,
    padding: 5,
    borderRadius: 25,
  },
  viewAll: {
    marginTop: 4,
    fontFamily: "Bitter_400Regular",
  },
  prayerList: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 2,
  },
  prayerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: 170,
    height: 80,
    borderRadius: 4,
    margin: 8,
    backgroundColor: "#FFBD33",
  },
  prayerCardView: {
    width: 180,
    height: 200,
    marginRight: 20,
    flex: 1,
  },
  prayerCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Bitter_400Regular",
    marginTop: 5,
  },
  prayerCardText: {
    paddingLeft: 10,
  },
  prayerCount: {
    width: "100%",
    height: 20,
    paddingLeft: 10,
    justifyContent: "space-evenly",
    fontFamily: "Bitter_400Regular",
    fontSize: 12,
  },
  prayerCardTextView: {
    flex: 1,
  },
});
