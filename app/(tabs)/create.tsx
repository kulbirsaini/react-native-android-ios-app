import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import VideoScreen from "@/components/VideoScreen";
import { icons } from "@/constants";
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createPost } from "@/lib/api";
import { validateImage, validateVideo } from "@/lib/validator";

const DEFAULT_FORM_STATE = {
  title: "",
  video: null,
  thumbnail: null,
};

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ ...DEFAULT_FORM_STATE });

  const openPicker = async (fileType: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [fileType === "image" ? "images" : "videos"],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (fileType === "image") {
        setForm((f) => ({ ...f, thumbnail: asset }));
      } else {
        setForm((f) => ({ ...f, video: asset }));
      }
    }
  };

  const submit = async () => {
    let errorMessage = null;
    const title = form.title.trim();
    const video = form.video;
    const thumbnail = form.thumbnail;

    if (!title && !video && !thumbnail) {
      errorMessage = "Please fill in all fields.";
    } else if (title.length < 4) {
      errorMessage = "Title must be at least 4 characters long.";
    } else {
      const { valid: isVideoValid, message: videoErrorMessage } = validateVideo(video);
      if (!isVideoValid) {
        errorMessage = videoErrorMessage;
      } else {
        const { valid: isImageValid, message: imageErrorMessage } = validateImage(thumbnail);
        if (!isImageValid) {
          errorMessage = imageErrorMessage;
        }
      }
    }

    if (errorMessage) {
      return Alert.alert("Error", errorMessage);
    }

    setUploading(true);

    try {
      await createPost({ ...form });
      router.push("/home");
      Alert.alert("Success", "Post created succesfully!");
      setForm({ ...DEFAULT_FORM_STATE });
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      {uploading && <LoadingIndicator />}
      <ScrollView className="px-4 my-6">
        <Text className="text-xl text-white font-psemibold">Create New Post</Text>

        <FormField
          title="Title"
          value={form.title}
          placeholder="Give your post a catchy title..."
          handleChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>

          <TouchableOpacity className="" onPress={() => openPicker("video")}>
            {form.video ? (
              <VideoScreen
                id="new-upload-video"
                videoSource={{ uri: form.video.uri }}
                onPlayToEnd={() => {}}
                playerStyles="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} resizeMode="contain" className="w-1/2 h-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Upload Thumbnail</Text>

          <TouchableOpacity className="" onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image source={{ uri: form.thumbnail.uri }} resizeMode="cover" className="w-full h-64 rounded-2xl" />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image source={icons.upload} resizeMode="contain" className="w-5 h-5" />
                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton title="Submit & Publish" handlePress={submit} containerStyles="mt-7" isLoading={uploading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
