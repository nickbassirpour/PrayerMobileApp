import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[url]"
        options={{
          headerTitle: "url",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
