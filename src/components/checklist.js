import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";

export default ({ licitacao }) => {
  const [documentos, setDocumentos] = useState([]); // Tipos de documentos
  const [loading, setLoading] = useState(true); // Estado para exibir o carregamento
  const [selectedIds, setSelectedIds] = useState([]); // IDs selecionados (atual)
  const [initialSelectedIds, setInitialSelectedIds] = useState([]); // IDs originalmente selecionados
  const [idDocumentoLicitacaoMap, setIdDocumentoLicitacaoMap] = useState({}); // Mapeamento de id_documento para id_doc_licitacao
  const { user } = useContext(AuthContext);

  const fetchDocs = async () => {
    try {
      const response = await api.get("tipoDocumento/listar"); // Busca tipos de documentos
      const docsWithSelectionState = response.data.map((doc) => ({
        ...doc,
        selected: false, // Adiciona a propriedade selected para cada item
      }));
      fetchDocsLicitacao(docsWithSelectionState); // Chama o próximo fetch passando os tipos de documentos
    } catch (error) {
      console.error("Erro ao buscar tipos de documentos:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os tipos de documentos registrados."
      );
      setLoading(false);
    }
  };

  const fetchDocsLicitacao = async (docs) => {
    try {
      const response = await api.get("documentolicitacao/listar"); // Busca documentos da licitação
      const filteredDocs = response.data.filter(
        (doc) => doc.num_licitacao === licitacao.num_licitacao
      ); // Filtra os documentos pelo num_licitacao

      const licitacaoDocIds = filteredDocs.map((doc) => doc.id_documento); // Extrai os IDs dos documentos da licitação

      // Cria o mapeamento de id_documento para id_doc_licitacao
      const idMap = {};
      filteredDocs.forEach((doc) => {
        idMap[doc.id_documento] = doc.id_doc_licitacao;
      });

      setIdDocumentoLicitacaoMap(idMap); // Armazena o mapeamento

      // Atualiza os tipos de documentos para marcar os itens selecionados
      const updatedDocs = docs.map((doc) => ({
        ...doc,
        selected: licitacaoDocIds.includes(doc.id_documento), // Marca como selecionado se o ID estiver na tabela documentos_licitacao
      }));

      setDocumentos(updatedDocs); // Atualiza o estado com os documentos marcados
      setSelectedIds(licitacaoDocIds); // Atualiza os IDs selecionados para refletir a tabela documentos_licitacao
      setInitialSelectedIds(licitacaoDocIds); // Salva os IDs originalmente selecionados
    } catch (error) {
      console.error("Erro ao buscar documentos da licitação:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os documentos da licitação."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(); // Busca tipos de documentos e documentos da licitação
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
      console.log("Initial Selected IDs:", initialSelectedIds);
      console.log("Currently Selected IDs:", selectedIds);
  
      const removedIds = initialSelectedIds.filter(
        (id) => !selectedIds.includes(id)
      );
      console.log("IDs to be removed:", removedIds);
  
      for (const id of removedIds) {
        const idDocumentoLicitacao = idDocumentoLicitacaoMap[id];
        if (idDocumentoLicitacao) {
          console.log(
            `Attempting to delete id_doc_licitacao: ${idDocumentoLicitacao}`
          );
  
          // Testando DELETE com corpo
          try {
            await api.delete("documentolicitacao/deletar", {
              data: {
                id_doc_licitacao: idDocumentoLicitacao,
                usuario: user.usuario,
              },
            });
            console.log(`Deleted id_doc_licitacao: ${idDocumentoLicitacao}`);
          } catch (deleteError) {
            console.error(
              `Error deleting id_doc_licitacao: ${idDocumentoLicitacao}`,
              deleteError
            );
          }
        }
      }
  
      const newIds = selectedIds.filter((id) => !initialSelectedIds.includes(id));
      console.log("New IDs to be added:", newIds);
  
      for (const id of newIds) {
        const data = {
          id_documento: id,
          num_licitacao: licitacao.num_licitacao,
          usuario: user.usuario,
        };
        console.log(`Adding new document:`, data);
        await api.post("documentolicitacao/cadastrar", data);
      }
  
      Alert.alert("Sucesso", "Os documentos selecionados foram salvos com sucesso!");
      fetchDocs(); // Recarrega os documentos para refletir os dados persistidos
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
                <Text style={styles.emptyText}>Nenhum tipo de documento encontrado.</Text>
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
    maxHeight: 300,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
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
    backgroundColor: "#4CAF50",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  cardTextSelected: {
    color: "#fff",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
