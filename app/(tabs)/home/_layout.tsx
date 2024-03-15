import { Stack, useGlobalSearchParams } from "expo-router";

export default function StackLayout() {
  const { category } = useGlobalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[category]"
        options={{
          headerTitle: `${category}`,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
