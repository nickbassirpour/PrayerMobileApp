import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  useFonts,
  Bitter_400Regular,
  Bitter_700Bold,
} from "@expo-google-fonts/bitter";

const Quote = () => {
  let [fontsLoaded, fontError] = useFonts({
    Bitter_400Regular,
    Bitter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View>
      <Text style={styles.quote}>
        “If the Church were not divine this Council (Vatican II) would have
        buried it.”{"\n"} (Cardinal Siri, p. 50.)
      </Text>
    </View>
  );
};

export default Quote;

const styles = StyleSheet.create({
  quote: {
    justifyContent: "space-evenly",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    lineHeight: 30,
    fontFamily: "Bitter_400Regular",
  },
});
