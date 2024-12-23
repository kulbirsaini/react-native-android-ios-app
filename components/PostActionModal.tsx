import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "./CustomBottomSheetModal";
import { icons } from "@/constants";
import { usePostActionContext } from "@/context/PostActionContextProvider";
import { useGlobalContext } from "@/context/GlobalContextProvider";

const PostActionModal = () => {
  const { user } = useGlobalContext();
  const { currentPostId, setCurrentPostId, save: savePost, unsave: unsavePost } = usePostActionContext();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const hideModal = () => {
    setCurrentPostId(null);
  };

  const onSavePost = async () => {
    bottomSheetRef.current?.close();
    await savePost();
  };

  const onUnsavePost = async () => {
    bottomSheetRef.current?.close();
    await unsavePost();
  };

  useEffect(() => {
    if (currentPostId) {
      bottomSheetRef.current.present();
    }
  }, [currentPostId]);

  return (
    <CustomBottomSheetModal ref={bottomSheetRef} onBackdropTouch={hideModal} onDismiss={hideModal}>
      {currentPostId && (
        <View className="bg-black-100 flex-col py-8">
          {!user.likedPosts.includes(currentPostId) && (
            <TouchableOpacity
              className="flex-row gap-3 py-2 pl-6 items-center justify-start border-secondary-100 border-b first:border-t"
              activeOpacity={0.7}
              onPress={onSavePost}
            >
              <Image source={icons.bookmark} resizeMode="contain" className="w-3 h-3" />
              <Text className="text-white font-pregular text-lg">Save</Text>
            </TouchableOpacity>
          )}
          {user.likedPosts.includes(currentPostId) && (
            <TouchableOpacity
              className="flex-row py-2 pl-6 gap-3 items-center justify-start border-secondary-100 border-b first:border-t"
              onPress={onUnsavePost}
            >
              <Image source={icons.trash} resizeMode="contain" className="w-3 h-3" />
              <Text className="text-white font-pregular text-lg">Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </CustomBottomSheetModal>
  );
};

export default PostActionModal;
