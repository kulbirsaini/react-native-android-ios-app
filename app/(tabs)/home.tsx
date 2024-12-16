import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import useAppwrite from "@/hooks/useAppwrite";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: videos, isLoading, error, refresh } = useAppwrite(getAllPosts, []);
  const { data: latestVideos, isLoading: isLoadingLatestVideos } = useAppwrite(getLatestPosts, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (error) {
    Alert.alert("Error", error.message);
  }

  const onSearch = (query: string) => {
    if (!query) {
      return Alert.alert("Error", "Please input something to search results.");
    }

    router.push(`/search/${query}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full relative">
      {(isLoading || isProcessing || isLoadingLatestVideos || refreshing) && <LoadingIndicator />}
      {useMemo(
        () => (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <VideoCard video={item} showMenu onToggleMenu={setCurrentPostId} />}
            ListHeaderComponent={() => (
              <View className="my-6 px-4 space-y-6">
                <View className="justify-between items-start flex-row mb-6">
                  <View>
                    <Text className="font-pmedium text-sm text-gray-100">Welcome Back!</Text>
                    <Text className="text-2xl font-psemibold text-white">{user?.username}!</Text>
                  </View>

                  <View className="mt-1.5">
                    <Image source={images.logoSmall} resizeMode="contain" className="w-9 h-10" />
                  </View>
                </View>

                <SearchInput placeholder="Search for a video topic" onSearch={onSearch} />

                <View className="w-full flex-1 pt-5 pb-8">
                  <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
                  <Trending posts={latestVideos} />
                </View>
              </View>
            )}
            ListEmptyComponent={() => <EmptyState title="No Videos Found!" subtitle="Be the first one to upload a video!" />}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
        ),
        [videos, latestVideos]
      )}
    </SafeAreaView>
  );
};

export default Home;
