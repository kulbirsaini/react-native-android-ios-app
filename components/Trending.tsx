import { FlatList, Image, ImageBackground, TouchableOpacity } from "react-native";
import EmptyState from "./EmptyState";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { icons } from "@/constants";
import VideoScreen from "./VideoScreen";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.1 },
};

const zoomOut = {
  0: { scale: 1.1 },
  1: { scale: 0.9 },
};

const TrendingItem = ({ activeItemId, item }) => {
  const { setCurrentlyPlayingVideoId } = useGlobalContext();
  const [play, setPlay] = useState(false);

  const onVideoPlay = () => {
    setCurrentlyPlayingVideoId(item.id);
    setPlay(true);
  };

  const onVideoEnd = () => {
    setCurrentlyPlayingVideoId(null);
    setPlay(false);
  };

  return (
    <Animatable.View className="mr-5" animation={activeItemId === item.id ? zoomIn : zoomOut} duration={500}>
      {play ? (
        <VideoScreen
          id={item.id}
          videoSource={item.videoUrl}
          onPlayToEnd={onVideoEnd}
          playerStyles="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        />
      ) : (
        <TouchableOpacity className="relative justify-center items-center" activeOpacity={0.7} onPress={onVideoPlay}>
          <ImageBackground
            source={{ uri: item.thumbnailUrl }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItemId, setActiveItem] = useState(null);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TrendingItem activeItemId={activeItemId} item={item} />}
      ListEmptyComponent={() => <EmptyState title="No Videos Found!" subtitle="Be the first one to upload a video!" />}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 0, y: 0 }}
    />
  );
};

export default Trending;
