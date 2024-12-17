import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import useAppwrite from "@/hooks/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, Text, Image, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { searchPosts } from "@/lib/api";

const Search = () => {
  const { query } = useLocalSearchParams();
  const searchFn = useCallback(() => searchPosts(query), [query]);
  const { data: videos, isLoading, error, refresh } = useAppwrite(searchFn, []);

  useEffect(() => {
    refresh();
  }, [query]);

  if (error) {
    console.error(videos, isLoading, error);
  }

  const onSearch = (query) => {
    if (!query) {
      return Alert.alert("Error", "Please input something to search results.");
    }

    router.setParams({ query });
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      {isLoading && <LoadingIndicator />}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} canSave />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
                <Text className="text-2xl font-psemibold text-white">{query}</Text>
              </View>

              <View className="mt-1.5">
                <Image source={images.logoSmall} resizeMode="contain" className="w-9 h-10" />
              </View>
            </View>

            <View className="mt-6 mb-8">
              <SearchInput placeholder="Search for a video topic" initialQuery={query} onSearch={onSearch} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {!isLoading && <EmptyState title="No videos found for this query!" subtitle="Be the first one to upload a video!" />}
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
