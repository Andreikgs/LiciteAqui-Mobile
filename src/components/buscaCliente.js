import React, { useEffect, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../constants/api";

export default function BuscaCliente({ onClienteChange }) {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/cliente/listar/todos");
        setClientes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        Alert.alert("Erro", "Não foi possível carregar os clientes.");
      }
    };

    fetchClientes();
  }, []);

  const handleClienteChange = (clienteId) => {
    setSelectedCliente(clienteId);
    onClienteChange(clienteId); // Notifica o componente pai
  };

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedCliente}
        onValueChange={handleClienteChange}
        style={styles.picker}
      >
        <Picker.Item label="Selecione um cliente" value="" />
        {clientes.map((cliente) => (
          <Picker.Item
            key={cliente.id_cliente}
            label={cliente.razao_social}
            value={cliente.id_cliente}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 5,
    padding: 10,
    width:'100%'
  },
  picker: {
    height: 50,
  },
});
