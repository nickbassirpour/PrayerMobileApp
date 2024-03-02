import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";

const Article = () => {
  const { category, url } = useLocalSearchParams();

  const article = `../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.html`;
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={require(article)}
        scrollEnabled={true}
        style={{
          flex: 1,
          border: 10,
        }}
      />
    </View>
  );
};

export default Article;
