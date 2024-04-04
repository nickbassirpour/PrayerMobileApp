import {
  View,
  Text,
  Linking,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Link, router } from "expo-router";
import React from "react";
// import WebView from "react-native-webview";
import AutoHeightWebView from "../../../../../components/AutoHeightWebView";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
// import WebView from "react-native-autoheight-webview";

const Article = () => {
  const { category, url } = useLocalSearchParams();

  let article;
  if (category === "SOD" && url === "j197sd_FrancisAssisr_10-04") {
    article = require(`../../../../../data/articles/SOD/j197sd_FrancisAssisr_10-04.html`);
  } else if (category === "SOD" && url === "stBrigid") {
    article = require(`../../../../../data/articles/SOD/stBrigid.html`);
  } else if (category === "SOD" && url === "h255_Bri") {
    article = require(`../../../../../data/articles/SOD/h255_Bri.html`);
  } else if (category === "SOD" && url === "test") {
    article = require(`../../../../../data/articles/SOD/test.html`);
  } else if (category === "SOD" && url === "j161sd_Circumcision_1-1.html") {
    article = require(`../../../../../data/articles/SOD/j161sd_Circumcision_1-1.html`);
  } else if (category === "SOD" && url === "j293sd_Basili_1-2.html") {
    article = require(`../../../../../data/articles/SOD/j293sd_Basili_1-2.html`);
  } else if (category === "SOD" && url === "j162sd_St.Marcarius_1-02.html") {
    article = require(`../../../../../data/articles/SOD/j162sd_St.Marcarius_1-02.html`);
  } else {
    article = require(`../../../../../data/articles/error.html`);
  }

  const goBack = () => {
    router.back();
  };

  return (
    <ScrollView
      // style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={
        {
          // flexGrow: 1,
        }
      }
    >
      <StatusBar hidden={false} />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "white",
          paddingTop: 40,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 25,
            }}
          >
            <Pressable onPress={goBack}>
              <Text>Back</Text>
            </Pressable>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              padding: 10,
            }}
          >
            <Text>Saint of the Day</Text>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 25,
            }}
          >
            <Text>Next</Text>
          </View>
        </View>
        <AutoHeightWebView originWhitelist={["*"]} source={article} />
        {/* <WebView
          originWhitelist={["*"]}
          source={article}
          onShouldStartLoadWithRequest={(request) => {
            if (!request.url.includes(`${url}`)) {
              Linking.openURL(request.url);
              return false;
            }
            return true;
          }}
          style={{
            flex: 1,
            paddingTop: 35,
            width: Dimensions.get("window").width,
          }}
          scrollEnabled={false}
        /> */}
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View style={{ paddingBottom: 10 }}>
            <Text style={{ fontSize: 20 }}>Related Articles</Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <Text>Article 1</Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <Text>Article 1</Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <Text>Article 1</Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <Text>Article 1</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Article;
