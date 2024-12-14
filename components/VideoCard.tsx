import { icons } from "@/constants";
import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import VideoScreen from "./VideoScreen";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { savePost, unsavePost } from "@/lib/appwrite";
import LoadingIndicator from "./LoadingIndicator";
import React from "react";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  canSave = false,
  canDelete = false,
}) => {
  const showMenu = canDelete || canSave;
  const { user, setUser } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSavePost = async () => {
    setIsMenuOpen(false);
    setIsLoading(true);
    try {
      const result = await savePost(user, $id);
      if (result) {
        setUser((prevUser) => {
          return { ...prevUser, savedVideos: [...result.savedVideos] };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onUnsavePost = async () => {
    setIsMenuOpen(false);
    setIsLoading(true);

    try {
      const result = await unsavePost(user, $id);
      if (result) {
        setUser((prevUser) => {
          return { ...prevUser, savedVideos: [...result.savedVideos] };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
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
                {username}
              </Text>
            </View>
          </View>
          {showMenu && (
            <View className="py-2 pr-2 flex items-end">
              <TouchableOpacity activeOpacity={0.7} onPress={() => setIsMenuOpen((prev) => !prev)} className="pl-8">
                <Image source={icons.menu} resizeMode="contain" className="w-5 h-5" />
              </TouchableOpacity>
              {isMenuOpen && (
                <View className="bg-black-100 rounded-xl py-4 pl-6 pr-10 gap-y-4 border border-primary mt-2 flex-1 items-start absolute w-36 z-10 top-8">
                  {canSave && (
                    <TouchableOpacity
                      className="flex-row gap-3 items-center justify-start"
                      activeOpacity={0.7}
                      onPress={onSavePost}
                    >
                      <Image source={icons.bookmark} resizeMode="contain" className="w-3 h-3" />
                      <Text className="text-white font-pregular text-lg">Save</Text>
                    </TouchableOpacity>
                  )}
                  {canDelete && (
                    <TouchableOpacity className="flex-row gap-3 items-center justify-start" onPress={onUnsavePost}>
                      <Image source={icons.search} resizeMode="contain" className="w-3 h-3" />
                      <Text className="text-white font-pregular text-lg">Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {play ? (
          <VideoScreen videoSource={video} onPlayToEnd={() => setPlay(false)} playerStyles="w-full h-60 rounded-xl mt-3" />
        ) : (
          <TouchableOpacity
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl mt-3" resizeMode="cover" />
            <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VideoCard;
