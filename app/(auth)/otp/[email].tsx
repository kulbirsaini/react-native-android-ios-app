import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import LoadingIndicator from "@/components/LoadingIndicator";
import { images } from "@/constants";
import { requestOtp } from "@/lib/api";
import { isValidEmail } from "@/lib/validator";
import { router, Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, Alert, SafeAreaView, ScrollView, Image } from "react-native";

const Otp = () => {
  const { email: defaultEmail } = useLocalSearchParams();
  const [email, setEmail] = useState((defaultEmail as string) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async () => {
    if (!isValidEmail(email)) {
      return Alert.alert("Input Error", "Please enter a valid email address.");
    }

    setIsSubmitting(true);

    try {
      const { message } = await requestOtp(email);
      if (message) {
        Alert.alert("Success", message);
      }
      router.push("/confirm");
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
          <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[35px]" />
          <Text className="text-2xl text-white font-psemibold">Request Confirmation OTP</Text>

          <FormField
            title="Email"
            placeholder="Email Address"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <CustomButton
            title="Request Confirmation"
            handlePress={handleRequestOtp}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-7 gap-2 flex-row">
            <Text className="text-lg font-pregular text-gray-100">Don't have an account?</Text>
            <Link href="/signup" className="text-lg font-psemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;
