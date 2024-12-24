import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Alert, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { searchLikedPosts } from "@/lib/api";
import { usePagination } from "@/hooks/usePagination";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchFn = useCallback((params) => searchLikedPosts({ ...params, search: query }), [(user?.likedPosts, query)]);
  const { resources: posts, error, refresh, isLoading, getNextPage } = usePagination(searchFn, { dataKey: "posts" });

  const onRefresh = async () => {
    if (isLoading) {
      return;
    }

    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onSearch = (query: string) => {
    if (!query) {
      return Alert.alert("Error", "Please input something to search results.");
    }

    setQuery(query);
  };

  if (error) {
    return Alert.alert("Error", error.message);
  }

  return (
    <SafeAreaView className="h-full w-full bg-primary">
      {(isLoading || isProcessing) && <LoadingIndicator />}
      {useMemo(
        () => (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
            onEndReachedThreshold={0}
            onEndReached={getNextPage}
            ListHeaderComponent={
              <View className="px-4 my-6 space-y-6">
                <View className="justify-between items-center flex-row mb-6">
                  <Text className="text-white text-3xl font-pmedium">Liked Posts</Text>
                  <Image source={images.logoSmall} resizeMode="contain" className="w-10 h-10" />
                </View>

                <SearchInput placeholder="Search your liked posts" onSearch={onSearch} onSearchReset={() => setQuery("")} />
              </View>
            }
            ListEmptyComponent={() => (
              <>{!isLoading && <EmptyState title="No posts found!" subtitle="Adjust your search query to get some results." />}</>
            )}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
        ),
        [posts]
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
