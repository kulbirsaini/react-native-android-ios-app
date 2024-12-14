import { images } from "@/constants";
import { View, Text, Image } from "react-native";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import { populateVideos } from "@/lib/appwrite";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image source={images.empty} resizeMode="contain" className="w-[270px] h-[250px]" />
      <Text className="text-2xl font-psemibold text-white">{title}</Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <CustomButton title="Create Video" handlePress={() => router.push("/create")} containerStyles="w-full my-5" />
      {/* <CustomButton title="Populate Videos" handlePress={populateVideos} containerStyles="w-full my-5" /> */}
    </View>
  );
};

export default EmptyState;
