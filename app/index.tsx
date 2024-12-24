import { View, Text, ScrollView, Image } from "react-native";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import LoadingIndicator from "@/components/LoadingIndicator";

const Main = () => {
  const { isLoggedIn, isLoading } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/profile" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        {isLoading && <LoadingIndicator />}
        <View className="w-full h-full justify-center items-center px-4">
          <Image source={images.logo} className="w-[256px] h-[96px]" resizeMode="contain" />
          <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode="contain" />

          <View className="relative mt-5">
            <Text className="text-3xl text-center text-white font-bold">
              Discover Endless Possibilities with <Text className="text-secondary-200">RocketMoon</Text>
            </Text>
            <Image source={images.path} className="w-[126px] h-[13px] absolute -bottom-2 right-20" resizeMode="contain" />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: Embark on a journey of limitless exploration with RocketMoon!
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/signin")}
            containerStyles="w-full mt-7"
            isLoading={isLoading}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Main;
