import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import LoadingIndicator from "@/components/LoadingIndicator";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { login } from "@/lib/api";
import { storeEmail } from "@/lib/secureStore";
import { isValidEmail, isValidPassword } from "@/lib/validator";
import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, saveAuthToken, setIsLoggedIn } = useGlobalContext();

  const handleTextChange = (params) => {
    setForm((prevState) => {
      return { ...prevState, ...params };
    });
  };

  const handleSignIn = async () => {
    let errorMessage = null;
    const email = form.email.trim();
    const password = form.password.trim();
    if (!email || !password) {
      errorMessage = "Please fill in all the fields.";
    } else if (!isValidEmail(email)) {
      errorMessage = "Please enter a valid email address.";
    } else if (!isValidPassword(password)) {
      errorMessage = "Password should be at least 6 characters long.";
    }

    if (errorMessage) {
      return Alert.alert("Input Error", errorMessage);
    }

    setIsSubmitting(true);

    try {
      const { user, authToken, message, confirmationPending } = await login(email, password);
      if (user && authToken) {
        setUser(user);
        saveAuthToken(authToken);
        setIsLoggedIn(true);
      }

      if (confirmationPending) {
        storeEmail(email);
        Alert.alert("Notice", "Email confirmation is pending. Please check your email and enter OTP to confirm.");
        router.push(`/confirm`);
      } else {
        if (message) {
          Alert.alert("Notice", message);
        }
        router.push("/home");
      }
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
          <Text className="text-2xl text-white font-psemibold">Log in to Aora</Text>

          <FormField
            title="Email"
            placeholder="Email Address"
            value={form.email}
            handleChangeText={(value) => handleTextChange({ email: value })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Password"
            isPassword
            value={form.password}
            handleChangeText={(value) => handleTextChange({ password: value })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <CustomButton title="Sign In" handlePress={handleSignIn} containerStyles="mt-7" isLoading={isSubmitting} />

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

export default Signin;
