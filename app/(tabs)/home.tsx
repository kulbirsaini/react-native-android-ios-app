import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import useApi from "@/hooks/useApi";
import { getAllPosts, getLatestPosts } from "@/lib/api";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [refreshing, setRefreshing] = useState(false);
  //TODO: Extract pagination to a hook
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const getPagedPosts = useCallback(() => getAllPosts({ page: currentPage }), [currentPage]);
  const {
    data: { posts, page },
    isLoading,
    error,
    refresh,
  } = useApi(getPagedPosts, []);
  const {
    data: { posts: latestPosts },
    isLoading: isLoadingLatestPosts,
  } = useApi(getLatestPosts, []);

  useEffect(() => {
    if (!posts) {
      return;
    }

    setAllPosts((prevPosts) => {
      const newPosts = [...prevPosts];
      const seenPostIds = newPosts.map((post) => post.id);

      posts.forEach((post) => {
        if (!seenPostIds.includes(post.id)) {
          newPosts.push(post);
        }
      });

      return newPosts;
    });

    if (posts.length < 10) {
      setHasMorePages(false);
    }
  }, [posts]);

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
      {(isLoading || isProcessing || isLoadingLatestPosts || refreshing) && <LoadingIndicator />}
      {useMemo(
        () => (
          <FlatList
            data={allPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VideoCard video={item} showMenu onToggleMenu={setCurrentPostId} />}
            ListEmptyComponent={() => <EmptyState title="No posts found!" subtitle="Be the first one to create a post!" />}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            onEndReachedThreshold={0}
            onEndReached={() => hasMorePages && setCurrentPage(page + 1)}
            ListHeaderComponent={() => (
              <View className="my-6 px-4 space-y-6">
                <View className="justify-between items-center flex-row mb-6">
                  <View>
                    <Text className="font-pmedium text-sm text-gray-100">Welcome Back!</Text>
                    <Text className="text-2xl font-psemibold text-white">{user?.name}!</Text>
                  </View>

                  <Image source={images.logoSmall} resizeMode="contain" className="w-10 h-10" />
                </View>

                <SearchInput placeholder="Search for a topic" onSearch={onSearch} />

                <View className="w-full flex-1 pt-5 pb-8">
                  <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Posts</Text>
                  <Trending posts={latestPosts} />
                </View>
              </View>
            )}
          />
        ),
        [allPosts, latestPosts]
      )}
    </SafeAreaView>
  );
};

export default Home;
