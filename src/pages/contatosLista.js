import React, { useEffect, useState, useContext } from "react";
import {StyleSheet,View} from "react-native";
import BuscaCliente from "../components/buscaCliente";
import ListaContatos from "../components/listaContatos";
export default function App() {
  const [selectedCliente, setSelectedCliente] = useState(null); // Estado compartilhado

  return (
    <View style={styles.container}>
      {/* Passa o estado e a função de atualização para BuscaCliente */}
      <BuscaCliente onClienteChange={setSelectedCliente} />
      
      {/* Passa o cliente selecionado para ListaContatos */}
      <ListaContatos clienteId={selectedCliente} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
});
