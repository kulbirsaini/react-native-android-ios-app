import { View, ActivityIndicator } from "react-native";

const LoadingIndicator = () => {
  return (
    <View className="h-full w-full justify-center items-center absolute z-10">
      <ActivityIndicator
        color="#ff9c01"
        style={{ backgroundColor: "rgba(0 0 0 / 0.8)", borderRadius: 8, padding: 16 }}
        size="large"
      />
    </View>
  );
};

export default LoadingIndicator;
