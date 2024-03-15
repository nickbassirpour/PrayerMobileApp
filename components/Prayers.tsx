import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { PRAYERS_LIST } from "../data/constants";
import {
  useFonts,
  Bitter_400Regular,
  Bitter_700Bold,
} from "@expo-google-fonts/bitter";

const Prayers = () => {
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
        <Text style={styles.listTitleText}>Prayers</Text>
      </View>
      <FlatList
        style={styles.prayerList}
        data={PRAYERS_LIST}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.prayerCardView}>
            {/* <Link href="home/SOD/stBrigid"> */}
            <View>
              <View style={styles.prayerCard}>
                <Text style={styles.prayerCardTitle}></Text>
              </View>
              <View style={styles.prayerCardText}>
                <Text style={styles.prayerCardTitle}>{item.title}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Prayers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginVertical: 5,
  },
  listTitle: {
    paddingLeft: 10,
  },
  listTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Bitter_700Bold",
  },
  prayerList: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 2,
  },
  prayerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 60,
    borderRadius: 4,
    margin: 8,
    backgroundColor: "#77cdd9",
  },
  prayerCardView: {
    width: 130,
    height: 130,
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
