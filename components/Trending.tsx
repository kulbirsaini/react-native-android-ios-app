import { FlatList, Image, ImageBackground, TouchableOpacity } from "react-native";
import EmptyState from "./EmptyState";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import { icons } from "@/constants";
import VideoScreen from "./VideoScreen";

const zoomIn = {
  0: { scale: 0.9 },
  1: { scale: 1.1 },
};

const zoomOut = {
  0: { scale: 1.1 },
  1: { scale: 0.9 },
};

const TrendingItem = ({ activeItemId, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View className="mr-5" animation={activeItemId === item.$id ? zoomIn : zoomOut} duration={500}>
      {play ? (
        <VideoScreen
          videoSource={item.video}
          onPlayToEnd={() => setPlay(false)}
          playerStyles="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        />
      ) : (
        // <Video
        //   source={{ uri: item.video }}
        //   className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        //   resizeMode={ResizeMode.CONTAIN}
        //   useNativeControls
        //   shouldPlay
        //   onPlaybackStatusUpdate={(status) => {
        //     if (status.didJustFinish) {
        //       setPlay(false);
        //     }
        //   }}
        // />
        <TouchableOpacity className="relative justify-center items-center" activeOpacity={0.7} onPress={() => setPlay(true)}>
          <ImageBackground
            source={{ uri: item.thumbnail }}
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
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItemId={activeItemId} item={item} />}
      ListEmptyComponent={() => <EmptyState title="No Videos Found!" subtitle="Be the first one to upload a video!" />}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
