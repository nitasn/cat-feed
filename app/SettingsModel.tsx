import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Booten } from "./components";
import { store } from "./state";
import { dropShadow, signLTR, vh, vw } from "./stuff";

export default function useSettingsModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const onPress = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideModal();
    }
  };

  const modal = (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={hideModal}
    >
      <Pressable style={styles.modalDropshadow} onPress={onPress}>
        <Settings hideModal={hideModal} />
      </Pressable>
    </Modal>
  );

  return { modal, showModal, hideModal };
}

const currentVersion: string = "1.0.7.5";

const updateResultAtom = atom<Updates.UpdateCheckResult | undefined>(undefined);
const updateErrorAtom = atom<Error | undefined>(undefined);
const fetchingUpdateAtom = atom<boolean>(false);
const fetchingErrorAtom = atom<Error | undefined>(undefined);

Updates.checkForUpdateAsync()
  .then((update) => store.set(updateResultAtom, update))
  .catch((error) => store.set(updateErrorAtom, error));

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
      <Text style={styles.currentVersion}>Current Version: {currentVersion}</Text>
      <Update />
      <View style={styles.closeButtonContainer}>
        <MyButton title="Close" onPress={hideModal} />
      </View>
    </View>
  );
}

function WaitingText({ text }: { text: string }) {
  return (
    <View style={styles.waitingTextContainer}>
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
    <View style={styles.updateAvailableContainer}>
      <Text>An update is available!</Text>
      <TouchableOpacity onPress={doUpdate} style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update App</Text>
        <Ionicons name="paw-outline" color="white" size={16} />
      </TouchableOpacity>
    </View>
  );
}

function MyButton({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Booten onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Booten>
  );
}

const styles = StyleSheet.create({
  modalDropshadow: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33333377",
    ...(dropShadow as Object),
    width: 150 * vw,
    minHeight: 150 * vh,
    maxHeight: 150 * vh,
    transform: [{ translateX: signLTR * -25 * vw }, { translateY: -25 * vh }],
  },
  modalContainer: {
    backgroundColor: "#eeefef",
    borderRadius: 16,
    padding: 34,
    paddingTop: 32,
    paddingBottom: 28,
    width: 100 * vw - 72,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 36,
  },
  currentVersion: {
    marginBottom: 8,
  },
  closeButtonContainer: {
    marginTop: 40,
  },
  waitingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  updateAvailableContainer: {
    gap: 6,
  },
  updateButton: {
    padding: 12,
    backgroundColor: "rgb(60, 108, 190)",
    marginTop: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  updateButtonText: {
    fontSize: 16,
    color: "white",
  },
  buttonText: {
    fontSize: 18,
    color: "rgb(9, 115, 227)",
    alignSelf: "center",
    letterSpacing: 0.1,
  },
});
