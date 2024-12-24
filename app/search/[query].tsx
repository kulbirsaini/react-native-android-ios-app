import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { icons, images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, Text, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { getAllPosts } from "@/lib/api";
import { usePagination } from "@/hooks/usePagination";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const searchFn = useCallback((params) => getAllPosts({ ...params, search: query as string }), [query as string]);
  const { resources: posts, isLoading, error, refresh, getNextPage } = usePagination(searchFn, { dataKey: "posts" });

  useEffect(() => {
    refresh();
  }, [query as string]);

  if (error) {
    console.error(posts?.length, isLoading, error.message);
    return Alert.alert("Error", error.message);
  }

  const onSearch = (query: string) => {
    if (!query) {
      return Alert.alert("Error", "Please input something to search results.");
    }

    router.setParams({ query });
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
        onEndReachedThreshold={0}
        onEndReached={getNextPage}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className="justify-between items-center flex-row mb-4">
              <View className="flex-row gap-2 items-center">
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/home")} className="p-4">
                  <Image source={icons.leftArrow} resizeMode="contain" className="w-5 h-5" />
                </TouchableOpacity>
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
                  <Text className="text-2xl font-psemibold text-white">{query}</Text>
                </View>
              </View>

              <Image source={images.logoSmall} resizeMode="contain" className="w-10 h-10" />
            </View>

            <View className="mt-6 mb-8">
              <SearchInput placeholder="Search for a topic" initialQuery={query as string} onSearch={onSearch} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {!isLoading && (
              <EmptyState title="No post found for this query!" subtitle="Be the first one to create a post on this topic!" />
            )}
          </>
        )}
      />
      {(isLoading || isProcessing) && <LoadingIndicator />}
    </SafeAreaView>
  );
};

export default Search;
