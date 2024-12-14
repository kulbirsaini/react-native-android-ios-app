import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import LoadingIndicator from "@/components/LoadingIndicator";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleTextChange = (params) => {
    setForm((prevState) => {
      return { ...prevState, ...params };
    });
  };

  const handlSignUp = async () => {
    if (!form.email || !form.username || !form.password) {
      return Alert.alert("Error", "Please fill in all the fields.");
    }

    setIsSubmitting(true);

    try {
      const user = await createUser(form.email, form.password, form.username);
      setUser(user);
      setIsLoggedIn(true);
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
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
          <Text className="text-2xl text-white font-psemibold">Sign up to Aora</Text>

          <FormField
            title="Username"
            placeholder="Username"
            value={form.username}
            handleChangeText={(value) => handleTextChange({ username: value })}
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
            keyboardType="email-address"
          />

          <CustomButton title="Sign Up" handlePress={handlSignUp} containerStyles="mt-7" isLoading={isSubmitting} />

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
