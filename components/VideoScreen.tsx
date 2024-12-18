import { useGlobalContext } from "@/context/GlobalContextProvider";
import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { Alert, View } from "react-native";

const VideoScreen = ({ id, videoSource, onPlayToEnd, playerStyles }) => {
  const { currentlyPlayingVideoId, setCurrentlyPlayingVideoId } = useGlobalContext();

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  useEventListener(player, "statusChange", ({ error }) => {
    if (error) {
      Alert.alert("Error", "An error occurred while playing the video.");
      return onPlayToEnd();
    }
  });

  useEventListener(player, "playingChange", ({ isPlaying }) => {
    // If a paused player started playing,
    // set the currently playing video to current video so that all other players can pause
    if (isPlaying && currentlyPlayingVideoId !== id) {
      setCurrentlyPlayingVideoId(id);
    }
  });

  useEventListener(player, "playToEnd", onPlayToEnd);

  useEffect(() => {
    // If the current playing video changed from this video, pause this video player
    if (currentlyPlayingVideoId !== id) {
      player.pause();
    }
  }, [currentlyPlayingVideoId]);

  return (
    <View className={playerStyles}>
      <VideoView style={{ height: "100%", width: "100%" }} className={playerStyles} player={player} contentFit="contain" />
    </View>
  );
};

export default VideoScreen;
