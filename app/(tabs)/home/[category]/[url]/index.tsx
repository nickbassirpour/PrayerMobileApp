import {
  View,
  Text,
  useWindowDimensions,
  Image,
  Linking,
  Alert,
} from "react-native";
import React, { useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
// import htmlFinder from "../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.js";

const Article = ({ saintURL }) => {
  // let html = "../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.js";
  const { category, url } = useLocalSearchParams();
  // const { width } = useWindowDimensions();

  // let html = htmlFinder("j197sd_FrancisAssisr_10-04.js");

  // // const article = `../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.html`;
  // // let article = `../../../../../data/articles/`;
  // //SOD/j197sd_FrancisAssisr_10-04.html
  let article;
  if (category === "SOD" && url === "j197sd_FrancisAssisr_10-04") {
    article = require(`../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.html`);
  } else if (category === "SOD" && url === "stBrigid") {
    article = require(`../../../../../data/articles/SOD/stBrigid.html`);
  } else if (category === "SOD" && url === "h255_Bri") {
    article = require(`../../../../../data/articles/SOD/h255_Bri.html`);
  } else if (category === "SOD" && url === "test") {
    article = require(`../../../../../data/articles/SOD/test.html`);
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={article}
        scrollEnabled={true}
        onShouldStartLoadWithRequest={(request) => {
          if (!request.url.includes(`${url}`)) {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        style={{
          flex: 1,
          border: 10,
        }}
      />
    </View>
  );
};

export default Article;
