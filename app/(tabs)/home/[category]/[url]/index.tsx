import {
  View,
  Text,
  Linking,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
// import WebView from "react-native-webview";
import AutoHeightWebView from "../../../../../components/AutoHeightWebView";
import { StatusBar } from "expo-status-bar";
import NewSODList from "../../../../../data/lists/NewSODList";
import { SODList } from "../../../../../data/lists/SOD";
import { SafeAreaView } from "react-native-safe-area-context";
// import WebView from "react-native-autoheight-webview";

const Article = (href) => {
  const { category, url } = useLocalSearchParams();

  //cost of creating array vs having them all be created/imported every time
  //find memory usage/performance monitoring tool

  const htmlContent = SODList.find((article) => {
    return article.href === `../../../../../data/articles/${category}/${url}`;
  })?.localLink;

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
        <AutoHeightWebView originWhitelist={["*"]} source={htmlContent} />
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
