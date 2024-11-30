import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../constants/api";

export default () => {
  const [documentos, setDocumentos] = useState([]); // Estado para armazenar documentos
  const [loading, setLoading] = useState(true); // Estado para exibir o carregamento

  // Função para buscar documentos
  const fetchDocs = async () => {
    try {
      const response = await api.get("tipoDocumento/listar"); // Aguarda a API
      setDocumentos(response.data); // Configura os documentos com a propriedade `data`
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.descricao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Exibe enquanto carrega
      ) : (
        <FlatList
          data={documentos}
          keyExtractor={(item) => item.id_documento.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum documento encontrado.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
