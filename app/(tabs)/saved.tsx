import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import useAppwrite from "@/hooks/useAppwrite";
import { searchSavedPosts } from "@/lib/appwrite";
import { useCallback, useState } from "react";
import { View, Text, FlatList, Alert, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchFn = useCallback(() => searchSavedPosts(user?.savedVideos || [], query), [user?.savedVideos, query]);
  const { data: videos, error, refresh } = useAppwrite(searchFn, []);

  const onRefresh = async () => {
    setRefreshing(true);
    refresh();
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
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} canDelete />}
        ListHeaderComponent={
          <View className="px-4 my-6 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <Text className="text-white text-3xl font-pmedium">Saved Videos</Text>
              <Image source={images.logoSmall} resizeMode="contain" className="w-9 h-10" />
            </View>

            <SearchInput placeholder="Search your saved videos" onSearch={onSearch} onSearchReset={() => setQuery("")} />
          </View>
        }
        ListEmptyComponent={() => (
          <EmptyState title="No videos found!" subtitle="Adjust your search query to get some results." />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
