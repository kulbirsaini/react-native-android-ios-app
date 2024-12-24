import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import LoadingIndicator from "@/components/LoadingIndicator";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { getUserPosts, logout } from "@/lib/api";
import { RefreshControl } from "react-native-gesture-handler";
import { storeAuthToken } from "@/lib/secureStore";
import { usePagination } from "@/hooks/usePagination";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [refreshing, setRefreshing] = useState(false);
  const userPostsFn = useCallback((params) => getUserPosts({ ...params, userId: user?.id?.toString() }), [user?.id]);
  const { resources: posts, isLoading, error, refresh, getNextPage } = usePagination(userPostsFn, { dataKey: "posts" });
  const [isSigningOut, setIsSigningOut] = useState(false);

  // In case use logs out and logs in as another user
  useEffect(() => {
    refresh();
  }, [user?.id]);

  if (error) {
    console.error(user, posts.length, isLoading, error.message);
  }

  const onRefresh = async () => {
    if (isLoading) {
      return;
    }

    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onLogout = async () => {
    setIsSigningOut(true);

    try {
      await logout();
      storeAuthToken("");
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/signin");
    } catch (error) {
      console.error(error);
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
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
            onEndReachedThreshold={0}
            onEndReached={getNextPage}
            ListHeaderComponent={() => (
              <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                <TouchableOpacity className="w-full items-end mb-10" onPress={onLogout}>
                  <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
                </TouchableOpacity>

                <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                  <Image source={{ uri: user?.avatar }} resizeMode="contain" className="w-[90%] h-[90%] rounded-lg" />
                </View>

                <InfoBox title={user?.name} containerStyles="mt-5" titleStyles="text-lg" />

                <View className="mt-5 flex-row">
                  <InfoBox title={posts?.length} subtitle="Posts" containerStyles="mr-10" titleStyles="text-xl" />
                  <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <>{!isLoading && <EmptyState title="No posts found!" subtitle="Be the first one to create a post!" />}</>
            )}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
        ),
        [posts]
      )}
    </SafeAreaView>
  );
};

export default Profile;
