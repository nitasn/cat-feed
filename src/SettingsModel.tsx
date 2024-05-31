import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  GestureResponderEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { nameAtom, store } from "./state";
import { dropShadow, vw } from "./stuff";
import { Booten } from "./components";

export default function useSettingsModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const onPress = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      // when cilcking the dropshadow (and not the modal's main area)
      hideModal();
    }
  };

  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={hideModal}>
      <Pressable style={styles.modalDropshadow} onPress={onPress}>
        <Settings hideModal={hideModal} />
      </Pressable>
    </Modal>
  );

  return { modal, showModal, hideModal };
}

const currentVersion = "1.0.7.2";

const updateResultAtom = atom<Updates.UpdateCheckResult | undefined>(undefined);
const updateErrorAtom = atom<Error | undefined>(undefined);

Updates.checkForUpdateAsync()
  .then((update) => store.set(updateResultAtom, update))
  .catch((error) => store.set(updateErrorAtom, error));

const fetchingUpdateAtom = atom<boolean>(false);
const fetchingErrorAtom = atom<Error | undefined>(undefined);

async function doUpdate() {
  try {
    store.set(fetchingUpdateAtom, true);
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch (err) {
    store.set(fetchingErrorAtom, err as Error);
  } finally {
    store.set(fetchingUpdateAtom, false);
  }
}

function Settings({ hideModal }: { hideModal: () => void }) {
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.header}>Settings</Text>

      <Text style={{ marginBottom: 8 }}>Current Version: {currentVersion}</Text>
      <Update />

      <View style={{ marginTop: 40 }}>
        <MyButton title="Close" onPress={hideModal} />
        {/* {__DEV__ && <MyButton title="Welcome Screen" onPress={() => store.set(nameAtom, "nobody")} />} */}
      </View>
    </View>
  );
}

function WaitingText({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Text>{text}</Text>
      <ActivityIndicator size="small" color="black" />
    </View>
  );
}

function Update() {
  const updateResult = useAtomValue(updateResultAtom);
  const updateError = useAtomValue(updateErrorAtom);
  const fetchingUpdate = useAtomValue(fetchingUpdateAtom);
  const fetchingError = useAtomValue(fetchingErrorAtom);

  if (updateError) {
    return (
      <Text>
        Couldn't check for updates :/{"\n"}
        {updateError.message}
      </Text>
    );
  }

  if (fetchingUpdate) {
    return <WaitingText text="Fetching the update..." />;
  }

  if (fetchingError) {
    return (
      <Text>
        Couldn't fetch update :/{"\n"}
        {fetchingError.message}
      </Text>
    );
  }

  if (!updateResult) {
    return <WaitingText text="Checking for updates..." />;
  }

  if (!updateResult.isAvailable) {
    return <Text>App is up to date :)</Text>;
  }

  return (
    <View>
      <Text>An upadte is available!</Text>
      <TouchableOpacity
        onPress={doUpdate}
        style={{
          padding: 12,
          backgroundColor: "rgb(60, 108, 190)",
          marginTop: 16,
          borderRadius: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Update App</Text>
        <Ionicons name="paw-outline" color="white" size={16} />
      </TouchableOpacity>
    </View>
  );
}

function MyButton({ title, onPress }: { title: string; onPress?: () => void }) {
  return Platform.select({
    android: (
      <Booten onPress={onPress}>
        <Text style={{ fontSize: 18, color: "rgb(9, 115, 227)", alignSelf: "center" }}>{title}</Text>
      </Booten>
    ),
    ios: <Button title={title} onPress={onPress}/>
  });
}

const styles = StyleSheet.create({
  modalDropshadow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33333377",
    ...(dropShadow as Object),
  },
  modalContainer: {
    backgroundColor: "#eeefef",
    borderRadius: 16,
    padding: 34,
    paddingTop: 30,
    paddingBottom: 24,
    width: 100 * vw - 72,
  },
  header: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 32,
  },
});
