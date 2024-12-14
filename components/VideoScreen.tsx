import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { View } from "react-native";

const VideoScreen = ({ videoSource, onPlayToEnd, playerStyles }) => {
  //videoSource = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", { isPlaying: player.playing });
  useEventListener(player, "playToEnd", onPlayToEnd);

  return (
    <View className={playerStyles}>
      <VideoView style={{ height: "100%", width: "100%" }} className={playerStyles} player={player} contentFit="contain" />
    </View>
  );
};

export default VideoScreen;
