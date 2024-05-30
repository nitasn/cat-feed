import { useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { nameAtom, store } from "./state";

export default function useSettingsModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={hideModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Hello World!</Text>
          <Button title="Hide Modal" onPress={hideModal} />
          <Button title="debug" onPress={() => store.set(nameAtom, "nobody")} />
        </View>
      </View>
    </Modal>
  );

  return { modal, showModal, hideModal };
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33333344",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 35,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
