import React, { useEffect, useState, useContext, useCallback  } from "react";
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
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../constants/api";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../contexts/auth";
import Checklist from "../components/checklist"; // Certifique-se de que o componente está exportado corretamente

export default function ListaLicitacoes() {
  const [licitacoes, setLicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLicitacao, setSelectedLicitacao] = useState(null);
  const [modalChecklist, setModalChecklist] = useState(false); // Estado para controle do modal do Checklist

  // Campos do modal de edição
  const [numLicitacao, setNumLicitacao] = useState("");
  const [objeto, setObjeto] = useState("");
  const [orgao, setOrgao] = useState("");
  const [dataLicitacao, setDataLicitacao] = useState("");
  const [status, setStatus] = useState("");

  const { user } = useContext(AuthContext);

  // Função para excluir a licitação
  const deleteLicitacao = async () => {
    if (!selectedLicitacao?.num_licitacao) {
      Alert.alert("Erro", "Nenhuma licitação selecionada.");
      console.warn("Delete attempt without a selected licitação.");
      return;
    }
    // console.log(selectedLicitacao.num_licitacao, user.usuario);
    try {
      await api.delete("/licitacao/deletar/", {
        data: {
          id_licitacao: selectedLicitacao.num_licitacao,
          usuario: user.usuario,
        }
      });
        Alert.alert("Sucesso", "Licitação excluída com sucesso!");
        setSelectedLicitacao(null);
        setDeleteModalVisible(false);
        fetchLicitacoes(); // Refresh list
    } catch (error) {
      console.error("Erro ao excluir licitação:", error);
      Alert.alert("Erro", "Não foi possível excluir a licitação.");
    }
  };

  const editLicitacao = async () => {

    if (!numLicitacao || !objeto || !orgao || !dataLicitacao || !status) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
  
    if (!selectedLicitacao?.id_licitacao) {
      Alert.alert("Erro", "Licitação não selecionada.");
      return;
    }
  
    try {
      await api.put("/licitacao/atualizar/", {
        id_licitacao: selectedLicitacao.id_licitacao,
        num_licitacao: numLicitacao,
        modalidade: selectedLicitacao.modalidade,
        orgao,
        portal: selectedLicitacao.portal,
        numero_identificacao: selectedLicitacao.numero_identificacao,
        status_licitacao: status,
        objeto,
        cidade: selectedLicitacao.cidade,
        estado: selectedLicitacao.estado,
        data_licitacao: dataLicitacao,
        usuario: user.usuario,
      });
  
      Alert.alert("Sucesso", "Licitação atualizada com sucesso!");
      setModalVisible(false);
      fetchLicitacoes(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao atualizar licitação:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar a licitação.");
    }
  };

  // Busca as licitações na API
  const fetchLicitacoes = async () => {
    try {
      const response = await api.get("/licitacao/listar");
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setLicitacoes(data);
    } catch (error) {
      console.error("Erro ao buscar licitações:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados das licitações.");
    } finally {
      setLoading(false);
    }
  };

  // Mantém a edição intacta
  const openEditModal = (item) => {
    setSelectedLicitacao(item);
    setNumLicitacao(item.num_licitacao || "");
    setObjeto(item.objeto || "");
    setOrgao(item.orgao || "");
    setDataLicitacao(item.data_licitacao || "");
    setStatus(item.status_licitacao || "");
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
        fetchLicitacoes();
    }, [])
  );

  const openChecklistModal = (item) => {
    setSelectedLicitacao(item);
    setModalChecklist(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => openChecklistModal(item) }
    >
      <View>
        <Text style={styles.cardTitle}>{item.num_licitacao}</Text>
        <Text style={styles.cardSubtitle}>Objeto: {item.objeto}</Text>
        <Text>Órgão: {item.orgao}</Text>
        <Text>Data Licitação: {new Date(item.data_licitacao).toLocaleDateString()}</Text>
        <Text>
          Status: 
          {(() => {
            switch (item.status_licitacao) {
              case 1:
                return " Em Andamento";
              case 2:
                return " Derrota";
              case 3:
                return " Cancelada";
              case 4:
                return " Confirmada";
              case 5:
                return " Cadastrada";
              case 6:
                return " Suspensa";
              default:
                return " Desconhecido"; // Caso o status não esteja mapeado
            }
          })()}     
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => openEditModal(item)} // Abre o modal de edição
          style={styles.buttonEdit}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => {
            setSelectedLicitacao(item); // Define o item selecionado
            setDeleteModalVisible(true); // Abre o modal de exclusão
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
          data={licitacoes}
          keyExtractor={(item) => item.id_licitacao.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>Nenhuma licitação encontrada.</Text>}
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
              <Text style={styles.modalTitle}>Editar Licitação</Text>
              <Text style={styles.label}>Número da Licitação</Text>
              <TextInput
                style={styles.input}
                value={numLicitacao}
                onChangeText={setNumLicitacao}
                placeholder="Digite o número da licitação"
              />
              <Text style={styles.label}>Objeto</Text>
              <TextInput
                style={styles.input}
                value={objeto}
                onChangeText={setObjeto}
                placeholder="Digite o objeto"
              />
              <Text style={styles.label}>Órgão</Text>
              <TextInput
                style={styles.input}
                value={orgao}
                onChangeText={setOrgao}
                placeholder="Digite o órgão"
              />
              <Text style={styles.label}>Data da Licitação</Text>
              <TextInput
                style={styles.input}
                value={dataLicitacao}
                onChangeText={setDataLicitacao}
              />
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                  style={styles.picker}
                >
                  <Picker.Item label="Em Andamento" value="1" />
                  <Picker.Item label="Derrota" value="2" />
                  <Picker.Item label="Cancelada" value="3" />
                  <Picker.Item label="Confirmada" value="4" />
                  <Picker.Item label="Cadastrada" value="5" />
                  <Picker.Item label="Suspensa" value="6" />
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
                  onPress={editLicitacao}
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
            <Text>
              Deseja realmente excluir a licitação{" "}
              {selectedLicitacao?.num_licitacao}?
            </Text>
            <View style={styles.divButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF6347" }]}
                onPress={deleteLicitacao}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal do Checklist */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalChecklist}
        onRequestClose={() => setModalChecklist(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Componente Checklist */}
            {selectedLicitacao && (
              <Checklist licitacao ={selectedLicitacao} /> // Passa a licitação selecionada para o Checklist
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalChecklist(false)} // Fecha o modal
            >
              <Text style={styles.buttonText}>Fechar</Text>
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
    padding: 16,
    backgroundColor: "#f5f5f5",
    width: "90%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  buttonDelete: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  buttonEdit: {
    backgroundColor: "#ffee4d",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5 
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
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
    width: "90%",
    maxWidth: 400,
    minHeight: 200,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  divButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  closeButton : {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    wdith: '90%'
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    flex: 1,
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5
  },
});
