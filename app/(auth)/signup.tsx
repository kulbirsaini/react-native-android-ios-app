import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import LoadingIndicator from "@/components/LoadingIndicator";
import { register } from "@/lib/api";
import { storeEmail } from "@/lib/secureStore";
import { isValidEmail, isValidPassword } from "@/lib/validator";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", passwordConfirmation: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (params) => {
    setForm((prevState) => {
      return { ...prevState, ...params };
    });
  };

  const handleSignUp = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const passwordConfirmation = form.passwordConfirmation.trim();

    let errorMessage = null;
    if (!email && !name && !password && !passwordConfirmation) {
      errorMessage = "Please fill in all the fields.";
    } else if (!isValidEmail(email)) {
      errorMessage = "Please enter a valid email address.";
    } else if (!isValidPassword(password)) {
      errorMessage = "Please enter a valid password.";
    } else if (password !== passwordConfirmation) {
      errorMessage = "Passwords do not match. Please fix.";
    }

    if (errorMessage) {
      return Alert.alert("Error", errorMessage);
    }

    setIsSubmitting(true);

    try {
      const { message } = await register(name, email, password, passwordConfirmation);
      storeEmail(form.email);
      Alert.alert("Success", message);
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
          <Image source={images.logo} resizeMode="contain" className="w-[176px] h-[48px]" />
          <Text className="text-2xl text-white font-psemibold">Sign up to RocketMoon</Text>

          <FormField
            title="Name"
            placeholder="Your full name"
            value={form.name}
            handleChangeText={(value) => handleTextChange({ name: value })}
            otherStyles="mt-10"
          />

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
          />

          <FormField
            title="Password Confirmation"
            placeholder="Retype your password"
            isPassword
            value={form.passwordConfirmation}
            handleChangeText={(value) => handleTextChange({ passwordConfirmation: value })}
            otherStyles="mt-7"
          />

          <CustomButton title="Sign Up" handlePress={handleSignUp} containerStyles="mt-7" isLoading={isSubmitting} />

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

export default Signup;
