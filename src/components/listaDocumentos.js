import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";

export default function ListaDocumentos({ documentos, atualizarLista }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Controle do modal de exclusão
  const [selectedDocumento, setselectedDocumento] = useState(null);
  const { user } = useContext(AuthContext);

  const salvarEdicao = async () => {
    if (!selectedDocumento || !selectedDocumento.descricao) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    try {
      await api.put("/tipoDocumento/atualizar", {
        id_documento: selectedDocumento.id_documento,
        descricao: selectedDocumento.descricao,
        usuario: user.usuario,
      });
      Alert.alert("Sucesso", "Documento atualizado com sucesso!");
      setModalVisible(false);
      atualizarLista();
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o documento.");
    }
  };

  const deletarDocumento = async () => {
    if (!selectedDocumento) {
      Alert.alert("Erro", "Nenhum documento selecionado.");
      return;
    }
    try {
      await api.delete("/tipoDocumento/deletar", {
        data: {
          id_documento: selectedDocumento.id_documento,
          usuario: user.usuario,
        },
      });
      Alert.alert("Sucesso", "Documento deletado com sucesso!");
      setDeleteModalVisible(false); // Fecha o modal
      atualizarLista(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      Alert.alert("Erro", "Não foi possível deletar o documento.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={documentos || []} // Garante que 'documentos' seja um array válido
        keyExtractor={(item, index) =>
          item?.id_documento ? item.id_documento.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setselectedDocumento(item);
              setModalVisible(true); // Abre o modal de edição
            }}
          >
            <Text style={styles.name}>{item.descricao}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF6347" }]}
                onPress={() => {
                  setselectedDocumento(item);
                  setDeleteModalVisible(true); // Abre o modal de exclusão
                }}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.info}>Nenhum documento cadastrado.</Text>}
      />

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={selectedDocumento?.descricao || ""}
              onChangeText={(text) =>
                setselectedDocumento({ ...selectedDocumento, descricao: text })
              }
              placeholder="Digite a descrição"
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "rgb(170, 209, 120)" }]}
              onPress={salvarEdicao}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Documento</Text>
            <Text style={styles.label}>
              Deseja realmente excluir o documento "{selectedDocumento?.descricao}"?
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF6347" }]}
              onPress={deletarDocumento}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  info: {
    textAlign: "center",
    color: "#555",
  },
});
