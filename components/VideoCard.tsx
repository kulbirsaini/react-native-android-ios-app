import { icons } from "@/constants";
import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import VideoScreen from "./VideoScreen";
import React from "react";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const VideoCard = ({
  video: {
    id,
    title,
    thumbnailUrl,
    videoUrl,
    user: { name, avatar },
  },
  showMenu = false,
  onToggleMenu = (id: string) => {},
}) => {
  const { setCurrentlyPlayingVideoId } = useGlobalContext();
  const [play, setPlay] = useState(false);

  const onVideoPlay = () => {
    setCurrentlyPlayingVideoId(id);
    setPlay(true);
  };

  const onVideoEnd = () => {
    setCurrentlyPlayingVideoId(null);
    setPlay(false);
  };

  return (
    <>
      <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border-secondary justify-center items-center p-0.5">
              <Image source={{ uri: avatar }} resizeMode="cover" className="w-full h-full rounded-lg" />
            </View>
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                {title}
              </Text>
              <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
                {name}
              </Text>
            </View>
          </View>
          {showMenu && (
            <View className="py-2 pr-2 flex items-end">
              <TouchableOpacity activeOpacity={0.7} onPress={() => onToggleMenu(id)} className="pl-8">
                <Image source={icons.menu} resizeMode="contain" className="w-5 h-5" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {play ? (
          <VideoScreen id={id} videoSource={videoUrl} onPlayToEnd={onVideoEnd} playerStyles="w-full h-60 rounded-xl mt-3" />
        ) : (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            activeOpacity={0.7}
            onPress={onVideoPlay}
          >
            <Image source={{ uri: thumbnailUrl }} className="w-full h-full rounded-xl mt-3" resizeMode="cover" />
            <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VideoCard;
