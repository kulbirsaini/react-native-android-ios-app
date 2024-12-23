import { Image, Text, View } from "react-native";
import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 mt-4 w-12">
      <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6" />
      <Text className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { setCurrentlyPlayingVideoId } = useGlobalContext();

  return (
    <Tabs
      screenListeners={{
        blur: () => setCurrentlyPlayingVideoId(null),
      }}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopColor: "#232533",
          borderTopWidth: 1,
          height: 64,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: "Liked",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.bookmark} color={color} name="Liked" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
