import EmptyState from "@/components/EmptyState";
import LoadingIndicator from "@/components/LoadingIndicator";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { icons, images } from "@/constants";
import useApi from "@/hooks/useApi";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { View, Text, Image, FlatList, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { searchPosts } from "@/lib/api";
import { usePostActionContext } from "@/context/PostActionContextProvider";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { setCurrentPostId, isProcessing } = usePostActionContext();
  const searchFn = useCallback(() => searchPosts(query as string), [query]);
  const { data: videos, isLoading, error, refresh } = useApi(searchFn, []);

  useEffect(() => {
    refresh();
  }, [query]);

  if (error) {
    console.error(videos, isLoading, error);
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
        data={videos}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard showMenu video={item} onToggleMenu={setCurrentPostId} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className="justify-between items-start flex-row mb-4">
              <View className="flex-row gap-2 items-center">
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/home")} className="p-4">
                  <Image source={icons.leftArrow} resizeMode="contain" className="w-5 h-5" />
                </TouchableOpacity>
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
                  <Text className="text-2xl font-psemibold text-white">{query}</Text>
                </View>
              </View>

              <View className="">
                <Image source={images.logoSmall} resizeMode="contain" className="w-9 h-10" />
              </View>
            </View>

            <View className="mt-6 mb-8">
              <SearchInput placeholder="Search for a video topic" initialQuery={query as string} onSearch={onSearch} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {!isLoading && <EmptyState title="No videos found for this query!" subtitle="Be the first one to upload a video!" />}
          </>
        )}
      />
      {(isLoading || isProcessing) && <LoadingIndicator />}
    </SafeAreaView>
  );
};

export default Search;
