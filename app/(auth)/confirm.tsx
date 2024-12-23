import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import LoadingIndicator from "@/components/LoadingIndicator";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { confirmViaOtp } from "@/lib/api";
import { getEmail, storeEmail } from "@/lib/secureStore";
import { isValidOtp } from "@/lib/validator";
import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Image, Alert } from "react-native";

const Confirm = () => {
  const { setUser, saveAuthToken, setIsLoggedIn } = useGlobalContext();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = getEmail();
  // If we don't have an email, we need to start over
  if (!email) {
    router.replace("/");
  }

  const handleConfirm = async () => {
    if (!isValidOtp(otp)) {
      return Alert.alert("Invalid OTP", "OTP Should be a six digit number.");
    }

    setIsSubmitting(true);

    try {
      const { user, authToken, message } = await confirmViaOtp(email, otp);
      storeEmail("");
      saveAuthToken(authToken);
      setUser(user);
      setIsLoggedIn(true);
      Alert.alert("Success", message);
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {isSubmitting && <LoadingIndicator />}
      <ScrollView>
        <View className="w-full h-full justify-center px-4 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[176px] h-[48px]" />
          <Text className="text-2xl text-white font-psemibold">Confirm your account</Text>

          <FormField
            title="OTP"
            placeholder="Six digit OTP from email"
            value={otp}
            handleChangeText={setOtp}
            otherStyles="mt-10"
          />

          <CustomButton title="Confirm" handlePress={handleConfirm} containerStyles="mt-7" isLoading={isSubmitting} />

          <View className="justify-center pt-7 gap-2 flex-row">
            <Text className="text-lg font-pregular text-gray-100">Have an account already?</Text>
            <Link href="/signin" className="text-lg font-psemibold text-secondary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Confirm;
