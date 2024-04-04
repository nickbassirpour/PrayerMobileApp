import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  //   Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Image } from "expo-image";
import NewSODList from "../data/lists/NewSODList";
import { SODImageLinks } from "../hooks/SODImages/ImageAssets";
import { Link } from "expo-router";

const SODList = () => {
  const renderLinks = ({ item }) => (
    <View>
      <Link href={item.href2}>
        <View key={item.title} style={styles.saintContainer}>
          <View style={styles.imageContainer}>
            {getMatchingImage(item.imageLink) && (
              <Image
                style={styles.SODImage}
                source={getMatchingImage(item.imageLink)}
              />
            )}
          </View>
          <View style={styles.textContainer}>
            <View style={styles.textRow}>
              <Text style={styles.SODText}>{item.title}</Text>
            </View>
            <View style={styles.textRow}>
              <Text style={styles.SODText}>{item.date}</Text>
            </View>
          </View>
        </View>
      </Link>
    </View>
  );

  const getMatchingImage = (imageLink) => {
    return SODImageLinks.find((link) => link.imageNum === imageLink).asset;
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.title}>The Saint of the Day</Text>
        <Text style={styles.subHeading}>And Important Feast Days</Text>
        <FlatList
          data={NewSODList}
          renderItem={renderLinks}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
};

export default SODList;

const styles = StyleSheet.create({
  title: {
    fontFamily: "Bitter_700Bold",
    fontSize: 25,
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 25,
  },
  subHeading: {
    fontFamily: "Bitter_700Bold",
    fontSize: 15,
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saintContainer: {
    flexDirection: "row",
    marginVertical: 6,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  imageContainer: {
    marginRight: 10,
  },
  SODImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  SODText: {
    fontFamily: "Bitter_400Regular",
    textAlign: "left",
    fontSize: 15,
  },
  textContainer: {
    flexDirection: "column",
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
