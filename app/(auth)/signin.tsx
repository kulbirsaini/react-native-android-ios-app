import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleTextChange = (params) => {
    setForm((prevState) => {
      return { ...prevState, ...params };
    });
  };

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      return Alert.alert("Error", "Please fill in all the fields.");
    }

    setIsSubmitting(true);

    try {
      const user = await signIn(form.email, form.password);
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
