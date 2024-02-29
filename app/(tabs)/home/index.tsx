import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import HomeSOD from "../../../components/HomeSOD";
import Prayers from "../../../components/Prayers";
import Quote from "../../../components/Quote";
import ForgottenTruths from "../../../components/ForgottenTruths";
import OrganicSociety from "../../../components/OrganicSociety";

const data = [
  { id: "HomeSOD", component: <HomeSOD /> },
  { id: "Prayers", component: <Prayers /> },
  { id: "Quote", component: <Quote /> },
  { id: "ForgottenTruths", component: <ForgottenTruths /> },
  { id: "OrganicSociety", component: <OrganicSociety /> },
];

const renderItem = ({ item }) => (
  <React.Fragment key={item.id}>{item.component}</React.Fragment>
);

const HomePage = () => {
  return (
    <View style={styles.appContainer}>
      <View>
        <StatusBar hidden />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
});
