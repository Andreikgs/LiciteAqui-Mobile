import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import api from "../constants/api";

export default function ListaContatos({ clienteId }) {
  const [contatos, setContatos] = useState([]);
  const [selectedContato, setSelectedContato] = useState(null);
  const [modalVisibleEditContato, setModalVisibleEditContato] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipoTel, setTipoTel] = useState("");
  const [tel, setTel] = useState("");
  const [sexo, setSexo] = useState("");
  const [cpf, setCpf] = useState("");
  const [ddd, setDDD] = useState("");
  const [dataBirth, setDataBirth] = useState(new Date());
  const [showDatePickerBirth, setShowDatePickerBirth] = useState(false);


  useEffect(() => {
    const fetchContatos = async () => {
      if (clienteId) {
        try {
          const response = await api.get(`/contatoCliente/listarPorId?cliente_id=${clienteId}`); // Envia o ID na URL
          setContatos(response.data);
        } catch (error) {
          console.error("Erro ao buscar contatos:", error);
          Alert.alert("Erro", "Não foi possível carregar os contatos.");
          setContatos([]); // Limpa a lista quando há erro na resposta de requisição
        }
      } else {
        setContatos([]); // Limpa a lista quando nenhum cliente está selecionado
      }
    };
    fetchContatos();
  }, [clienteId]); // Atualiza sempre que o clienteId mudar

  useEffect(() => {
    if (selectedContato) {
      setNome(selectedContato.nome_completo || "");
      setTel(selectedContato.telefone || "");
    }
  }, [selectedContato]);

  const salvarEdicaoContato = async () => {
    if (!nomeCompleto || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos para salvar.");
      return;
    }
    try {
      await api.put(`/contatoCliente/editar/${selectedContato.id_contato}`, {
        nome_completo: nomeCompleto,
        telefone,
      });
      Alert.alert("Sucesso", "Contato atualizado com sucesso!");
      setModalVisibleEditContato(false);
      setSelectedContato(null);
      setContatos((prev) =>
        prev.map((contato) =>
          contato.id_contato === selectedContato.id_contato
            ? { ...contato, nome_completo: nomeCompleto, telefone }
            : contato
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      Alert.alert("Erro", "Não foi possível atualizar o contato.");
    }
  };

  return (
    <View style={styles.container}>
      {clienteId ? (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id_contato.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedContato(item);
                setModalVisibleEditContato(true);
              }}
            >
              <Text style={styles.name}>{item.nome_completo}</Text>
              <Text style={styles.phone}>Tel: {item.telefone}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.info}>Sem contatos cadastrados.</Text>}
        />
      ) : (
        <Text style={styles.info}>Selecione um cliente para visualizar os contatos</Text>
      )}

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEditContato}
        onRequestClose={() => setModalVisibleEditContato(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Contato</Text>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome completo"
            />
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={tel}
              onChangeText={setTel}
              placeholder="Digite o telefone"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite o telefone"
              keyboardType="phone-pad"
            />
            <View style={styles.divButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisibleEditContato(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "rgb(170, 209, 120)" }]}
                onPress={salvarEdicaoContato}
              >
                <Text style={styles.buttonText}>Salvar</Text>
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
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "#555",
  },
  info: {
    textAlign: "center",
    color: "#555",
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
    alignItems: "center",
    justifyContent: "space-between",
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
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
  divButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
