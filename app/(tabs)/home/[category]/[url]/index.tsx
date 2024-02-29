import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Article = () => {
  const { category, url } = useLocalSearchParams();

  const article = `./${category}/${url}.html`;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
      }}
    >
      <Text>{`${article}`}</Text>
    </View>
  );
};

export default Article;
