import { View } from "react-native";
import React, { forwardRef } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProps, BottomSheetView } from "@gorhom/bottom-sheet";

interface Props extends BottomSheetModalProps {
  onBackdropTouch?: () => void;
  children: React.ReactNode;
}

const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(
  (
    { children, onBackdropTouch, enableDismissOnClose = true, enablePanDownToClose = true, enableDynamicSizing = true, ...rest },
    ref
  ) => {
    return (
      <BottomSheetModal
        ref={ref}
        style={{ flex: 1, backgroundColor: "grey", borderTopEndRadius: 8, borderTopStartRadius: 8 }}
        backgroundComponent={() => <View className="" />}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={enableDynamicSizing}
        enableDismissOnClose={enableDismissOnClose}
        backdropComponent={(props) => (
          <BottomSheetBackdrop onPress={onBackdropTouch} appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
        )}
        {...rest}
      >
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default CustomBottomSheetModal;
