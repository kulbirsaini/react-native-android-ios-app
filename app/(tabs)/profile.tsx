import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import LoadingIndicator from "@/components/LoadingIndicator";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import useAppwrite from "@/hooks/useAppwrite";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { getUserPosts, logout } from "@/lib/api";
import { RefreshControl } from "react-native-gesture-handler";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [refreshing, setRefreshing] = useState(false);
  const userPostsFn = useCallback(() => getUserPosts(user?.$id?.toString()), [user?.$id?.toString()]);
  const { data: videos, isLoading, error, refresh } = useAppwrite(userPostsFn, []);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    refresh();
  }, [user?.$id?.toString()]);

  if (error) {
    console.error(user?.$id, videos, isLoading, error);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onLogout = async () => {
    setIsSigningOut(true);

    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/signin");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      {(isLoading || isProcessing || isSigningOut) && <LoadingIndicator />}
      {useMemo(
        () => (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
            ListHeaderComponent={() => (
              <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                <TouchableOpacity className="w-full items-end mb-10" onPress={onLogout}>
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
            ListEmptyComponent={() => (
              <>{!isLoading && <EmptyState title="No videos found!" subtitle="Be the first one to upload a video!" />}</>
            )}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
        ),
        [videos]
      )}
    </SafeAreaView>
  );
};

export default Profile;
