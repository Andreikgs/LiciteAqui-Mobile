import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import api from "../constants/api";
import ListaDocumentos from "../components/listaDocumentos"; // Ajustado para começar com maiúscula
import CadastroDocumento from "../components/cadastroDocumento"; // Ajustado para começar com maiúscula

export default function GerenciamentoDocumentos() {
  const [documentos, setDocumentos] = useState([]);

  // Função para buscar documentos
  const fetchDocumentos = async () => {
    try {
      const response = await api.get("/tipoDocumento/listar");
      setDocumentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os documentos.");
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Componente para cadastro de novos documentos */}
      <CadastroDocumento atualizarLista={fetchDocumentos} />

      {/* Componente para exibir a lista de documentos */}
      <ListaDocumentos documentos={documentos} atualizarLista={fetchDocumentos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E0E0E0",
  },
});
