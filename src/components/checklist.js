import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";

export default ({ licitacao }) => {
  const [documentos, setDocumentos] = useState([]); // Estado para armazenar documentos
  const [loading, setLoading] = useState(true); // Estado para exibir o carregamento
  const [selectedIds, setSelectedIds] = useState([]); // Estado para armazenar os IDs selecionados
  const { user } = useContext(AuthContext);

  const fetchDocs = async () => {
    try {
      const response = await api.get("tipoDocumento/listar"); // Aguarda a API
      const docsWithSelectionState = response.data.map((doc) => ({
        ...doc,
        selected: false, // Adiciona a propriedade selected para cada item
      }));
      setDocumentos(docsWithSelectionState); // Configura os documentos com estado de seleção
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os tipos de documentos registrados."
      );
    } finally {
      setLoading(false); // Para o indicador de carregamento
    }
  };

  useEffect(() => {
    fetchDocs(); // Busca os documentos na montagem do componente
  }, []); // Array vazio para garantir que seja executado apenas uma vez

  const toggleSelection = (id) => {
    setDocumentos((prevDocs) =>
      prevDocs.map((doc) => {
        if (doc.id_documento === id) {
          const updatedSelection = !doc.selected;
          if (updatedSelection) {
            setSelectedIds((prev) => [...prev, id]); // Adiciona o ID selecionado
          } else {
            setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id)); // Remove o ID
          }
          return { ...doc, selected: updatedSelection };
        }
        return doc;
      })
    );
  };

  const saveSelectedDocuments = async () => {
    try {
      for (const id of selectedIds) {
        const data = {
          id_documento: id,
          num_licitacao: licitacao.num_licitacao,
          usuario: user.usuario,
        };
        await api.post("documentolicitacao/cadastrar", data); // Faz a requisição para cada ID
      }
      Alert.alert("Sucesso", "Os documentos selecionados foram salvos com sucesso!");
      setSelectedIds([]); // Limpa a seleção após o salvamento
      setDocumentos((prevDocs) =>
        prevDocs.map((doc) => ({ ...doc, selected: false })) // Reseta a seleção na interface
      );
    } catch (error) {
      console.error("Erro ao salvar documentos:", error);
      Alert.alert("Erro", "Não foi possível salvar os documentos selecionados.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.selected && styles.cardSelected]} // Altera o estilo se selecionado
      onPress={() => toggleSelection(item.id_documento)} // Alterna o estado de seleção ao clicar
    >
      <Text style={[styles.cardText, item.selected && styles.cardTextSelected]}>
        {item.descricao}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{licitacao.num_licitacao}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Exibe enquanto carrega
      ) : (
        <>
          <View style={styles.listContainer}>
            <FlatList
              data={documentos}
              keyExtractor={(item) => item.id_documento.toString()}
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum documento encontrado.</Text>
              }
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={saveSelectedDocuments}>
              <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    maxHeight: 300, // Altura fixa para a lista
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSelected: {
    backgroundColor: "#4CAF50", // Cor diferente quando selecionado
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  cardTextSelected: {
    color: "#fff", // Cor do texto muda quando selecionado
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width:'100%'
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
