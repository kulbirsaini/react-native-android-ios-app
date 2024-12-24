import { icons } from "@/constants";
import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";

const SearchInput = ({ placeholder, initialQuery = "", otherStyles = "", onSearch, onSearchReset = () => {}, ...props }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleTextChange = (value: string) => {
    setQuery(value);

    if (!value.trim() && query) {
      onSearchReset();
    }
  };

  return (
    <View className="w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center border-2 border-black-200 flex-row space-x-4">
      <TextInput
        className="text-base text-white flex-1 font-pregular mt-0.5"
        placeholder={placeholder}
        value={query}
        placeholderTextColor="#cdcde0"
        onChangeText={handleTextChange}
      />

      <TouchableOpacity onPress={() => onSearch(query)}>
        <Image source={icons.search} resizeMode="contain" className="w-5 h-5" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
