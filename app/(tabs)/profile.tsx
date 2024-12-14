import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import useAppwrite from "@/hooks/useAppwrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const userPostsFn = useCallback(() => getUserPosts(user?.$id?.toString()), [user?.$id?.toString()]);
  const { data: videos, isLoading, error, refresh } = useAppwrite(userPostsFn, []);

  useEffect(() => {
    refresh();
  }, [user?.$id?.toString()]);

  if (error) {
    console.log(user?.$id, videos, isLoading, error);
  }

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/signin");
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} canSave />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
              <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image source={{ uri: user?.avatar }} resizeMode="contain" className="w-[90%] h-[90%] rounded-lg" />
            </View>

            <InfoBox title={user?.username} containerStyles="mt-5" titleStyles="text-lg" />

            <View className="mt-5 flex-row">
              <InfoBox title={videos?.length} subtitle="Posts" containerStyles="mr-10" titleStyles="text-xl" />
              <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title="No videos found!" subtitle="Be the first one to upload a video!" />}
      />
    </SafeAreaView>
  );
};

export default Profile;
