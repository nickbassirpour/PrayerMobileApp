import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import SODList from "../../../../components/SODList";
import { StatusBar } from "expo-status-bar";

const CategoryList = () => {
  const { category } = useLocalSearchParams();

  return (
    <View>
      <StatusBar hidden={false} />
      {category === "SOD" ? <SODList /> : null}
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({});
