import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../constants/api"; // Supondo que o Axios esteja configurado em `api.js`
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from '../contexts/auth';

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const { user } = useContext(AuthContext);

  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSoc] = useState("");
  const [nomeFantasia, setNomeFant] = useState("");
  const [status, setStatus] = useState("");

  const fetchClientes = async () => {
    try {
      const response = await api.get("/cliente/listar");
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados dos clientes.");
    } finally {
      setLoading(false);
    }
  };

  const editCliente = async () => {
    if (!cnpj || !razaoSocial || !status || !nomeFantasia || !user) {
      Alert.alert("Dados obrigatórios não fornecidos.");
      return;
    }
  
    if (!selectedCliente?.id_cliente) {
      Alert.alert("Cliente não selecionado.");
      return;
    }
  
    try {
      const response = await api.put('/cliente/atualizar/', {
        id_cliente : selectedCliente.id_cliente,
        cnpj: cnpj,
        razao_social: razaoSocial,
        nome_fantasia: nomeFantasia,
        status: status,
        usuario : user.usuario
      });
  
      Alert.alert("Sucesso", "Cliente atualizado com sucesso!");
      setModalVisible(false);
      fetchClientes(); // Atualizar a lista de clientes
    } catch (error) {
      console.error("Erro completo:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar o cliente.");
    }
  };

  const deleteCliente = async () => {
    if (!selectedCliente?.id_cliente) return;
  
    try {
      await api.delete('/cliente/deletar/', {
        data: {
          id_cliente: selectedCliente.id_cliente,
          usuario: user.usuario,
        },
      });
      Alert.alert("Sucesso", "Cliente excluído com sucesso!");
      setSelectedCliente(null);
      setDeleteModalVisible(false);
      fetchClientes();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      Alert.alert("Erro", "Não foi possível excluir o cliente.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClientes();
    }, [])
  );
  
  useEffect(() => {
    if (selectedCliente) {
      setCnpj(selectedCliente.cnpj || "");
      setRazaoSoc(selectedCliente.razao_social || "");
      setNomeFant(selectedCliente.nome_fantasia || "");
      setStatus(selectedCliente.status ? "1" : "2");
    }
  }, [selectedCliente]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedCliente(item);
        setModalVisible(true);
      }}
    >
      <View>
        <Text style={styles.cardTitle}>{item.razao_social}</Text>
        <Text style={styles.cardSubtitle}>CNPJ: {item.cnpj}</Text>
        <Text>Status: {item.status ? "Ativo" : "Inativo"}</Text>
      </View>
      <View style={styles.divButton}>
         <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF6347" }]}
            onPress={() => {
              setSelectedCliente(item);
              setDeleteModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
      </View>  
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id_cliente.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>Sem clientes cadastrados.</Text>}
        />
      )}

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Editar Cliente</Text>
              <Text style={styles.label}>CNPJ</Text>
              <TextInput
                style={styles.input}
                value={cnpj}
                onChangeText={setCnpj}
                placeholder="Digite o CNPJ"
              />
              <Text style={styles.label}>Razão Social</Text>
              <TextInput
                style={styles.input}
                value={razaoSocial}
                onChangeText={setRazaoSoc}
                placeholder="Digite a razão social"
              />
              <Text style={styles.label}>Nome Fantasia</Text>
              <TextInput
                style={styles.input}
                value={nomeFantasia}
                onChangeText={setNomeFant}
                placeholder="Digite o nome fantasia"
              />
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Ativo" value="1" />
                  <Picker.Item label="Inativo" value="2" />
                  <Picker.Item label="Suspenso" value="3" />
                </Picker>
              </View>
              <View style={styles.divButton}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "rgb(170, 209, 120)" }]}
                  onPress={editCliente}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text>Deseja realmente excluir o cliente {selectedCliente?.razao_social}?</Text>
            <View style={styles.divButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF6347" }]}
                onPress={deleteCliente}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    width: '90%',
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  buttonDelete: {
    backgroundColor: "#FF6347",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center", // Centraliza o conteúdo dentro do botão
    marginHorizontal: 10,
    height: 40, // Defina a altura do botão para garantir que ele tenha um tamanho fixo
    width: 40,  // Defina a largura para o tamanho do botão
  },
  divButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

