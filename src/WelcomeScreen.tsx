import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// @ts-ignore
import catImg from "../assets/black-cat.png";
import BlurContainer from "./BlurContainer";
import { Name, names } from "./types";
import { personToImage } from "./stuff";
import { Ionicons } from "@expo/vector-icons";
import { useSetAtom } from "jotai";
import { nameAtom } from "./state";

export default function NamePrompt() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to <Text style={{ fontWeight: "bold" }}>Cat Feed</Text>
      </Text>
      <Image style={styles.catImage} source={catImg} />

      <BlurContainer style={styles.blurContainer}>
        {names.map((name) => (
          <PersonRow name={name} key={name} />
        ))}
      </BlurContainer>
    </View>
  );
}

function PersonRow({ name }: { name: Name }) {
  const setNameAtom = useSetAtom(nameAtom);

  const onPress = () => {
    setNameAtom(name);
  }

  return (
    <TouchableOpacity style={styles.personRow} onPress={onPress}>
      <Image source={personToImage[name]} style={styles.personBubble} />
      <Text style={styles.personName}>{name}</Text>

      <Ionicons name="chevron-forward" size={30} style={styles.personChevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
  },
  catImage: {
    width: 250,
    height: 250,
  },
  blurContainer: {
    justifyContent: "space-evenly",
    paddingVertical: 12,
  },
  personRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  personBubble: {
    width: 48,
    height: 48,
    borderRadius: Number.MAX_SAFE_INTEGER,
    borderWidth: 1.5,
    borderColor: "#676767b3",
  },
  personName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600"
  },
  personChevron: {
    marginStart: "auto"
  }
});
