import { Tabs } from "expo-router";

export default () => {
  return (
    <Tabs>
      <Tabs.Screen name="list" options={{ href: null }} />
      <Tabs.Screen
        name="search"
        options={{ headerShown: false, tabBarLabel: "Search" }}
      />
      <Tabs.Screen
        name="home"
        options={{ headerShown: false, tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="about"
        options={{ headerShown: false, tabBarLabel: "About" }}
      />
    </Tabs>
  );
};
