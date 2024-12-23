import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import useApi from "@/hooks/useApi";
import { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, Alert, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { searchLikedPosts } from "@/lib/api";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchFn = useCallback(() => searchLikedPosts(query), [user?.likedPosts, query]);
  const { data: videos, error, refresh, isLoading } = useApi(searchFn, []);

  const onRefresh = async () => {
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
            data={videos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
            ListHeaderComponent={
              <View className="px-4 my-6 space-y-6">
                <View className="justify-between items-center flex-row mb-6">
                  <Text className="text-white text-3xl font-pmedium">Liked Videos</Text>
                  <Image source={images.logoSmall} resizeMode="contain" className="w-10 h-10" />
                </View>

                <SearchInput placeholder="Search your liked posts" onSearch={onSearch} onSearchReset={() => setQuery("")} />
              </View>
            }
            ListEmptyComponent={() => (
              <>
                {!isLoading && <EmptyState title="No posts found!" subtitle="Adjust your search query to get some results." />}
              </>
            )}
            refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
          />
        ),
        [videos]
      )}
    </SafeAreaView>
  );
};

export default Bookmark;
