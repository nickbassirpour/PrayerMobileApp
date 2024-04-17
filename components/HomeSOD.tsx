import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import {
  useFonts,
  Bitter_400Regular,
  Bitter_700Bold,
} from "@expo-google-fonts/bitter";

const HomeSOD = () => {
  let [fontsLoaded, fontError] = useFonts({
    Bitter_400Regular,
    Bitter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const win = Dimensions.get("window");

  return (
    <View>
      <View>
        <Link href="home/SOD/j293sd_Basili_1-2.html">
          <ImageBackground
            source={require("../assets/images/saints/St_Francis.png")}
            style={{
              height: 400,
              width: win.width,
            }}
            imageStyle={[
              {
                flex: 1,
              },
            ]}
          >
            <Text style={styles.saintHeader}>Saint of the Day</Text>
            <View style={styles.saintTextGroup}>
              <Text style={styles.saintName}>St. Francis of Assisi</Text>
              <Text style={styles.saintDate}>October 4th{"\n"}</Text>
              <Text style={styles.saintText}>
                In the summer of 1215, St. Francis and a small group of friars
                were in Rome seeking approbation for his Rule.
              </Text>
            </View>
          </ImageBackground>
        </Link>
      </View>
      <View style={{ marginLeft: 20, marginBottom: 20 }}>
        <Link href="/home/SOD">
          <Text style={styles.viewAllSaints}>
            View all Saints and Feast Days
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default HomeSOD;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "column",
  },
  saintHeader: {
    fontFamily: "Bitter_700Bold",
    fontSize: 25,
    textAlignVertical: "center",
    marginLeft: 5,
    marginTop: 45,
  },
  saintName: {
    fontFamily: "Bitter_700Bold",
    fontSize: 20,
    marginLeft: 5,
  },
  saintText: {
    fontFamily: "Bitter_700Bold",
    fontSize: 15,
    marginLeft: 5,
  },
  saintTextGroup: {
    position: "absolute",
    bottom: 10,
  },
  saintDate: {
    fontFamily: "Bitter_700Bold",
    fontSize: 12,
    marginLeft: 5,
  },
  viewAllSaints: {
    fontFamily: "Bitter_700Bold",
    fontSize: 18,
    textAlignVertical: "center",
    color: "blue",
  },
});
