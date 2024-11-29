import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import api from "../constants/api";
import ListaServicos from "../components/listaServicos";
import CadastroServico from "../components/cadastroServico";

export default function ServicosPage() {
    const [servicos, setServicos] = useState([]);

    const fetchServicos = async () => {
        try {
            const response = await api.get("/tipoServico/listar");
            setServicos(response.data);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            alert("Erro ao carregar serviços.");
        }
    };

    useEffect(() => {
        fetchServicos();
    }, []);

    return (
        <View style={styles.container}>
            <CadastroServico atualizarLista={fetchServicos} /> {/* Passa a função de atualizar */}
            <ListaServicos servicos={servicos} atualizarLista={fetchServicos} /> {/* Passa a lista e a função */}
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
