import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../constants/api";
import { useFocusEffect } from "@react-navigation/native";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuários
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para buscar os usuários
  const fetchUsuarios = async () => {
    setLoading(true); // Inicia o carregamento
    try {
      const response = await api.get("/user/listar"); // API de listagem
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setUsuarios(data); // Atualiza o estado com os usuários
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados dos usuários.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // useFocusEffect para carregar os usuários ao montar o componente
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  // Renderizar um item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        Alert.alert("Usuário Selecionado", `Nome: ${item.nome_completo}`);
      }}
    >
      <View>
        <Text style={styles.cardTitle}>{item.nome_completo}</Text>
        <Text style={styles.cardSubtitle}>E-mail: {item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id_usuario.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>Nenhum usuário encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
});
