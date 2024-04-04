import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Asset } from "expo-asset";

const Assets = () => {
  const imageURI = Asset.fromModule(
    require("../assets/SODimages4/161_Decalogue.jpg")
  );
};

export default Assets;

const styles = StyleSheet.create({});
