import React, { useEffect, useState } from "react";
import {StyleSheet,View,Text,FlatList,ActivityIndicator,TouchableOpacity,Alert,Modal} from "react-native";
import api from "../constants/api"; // Certifique-se de que o Axios esteja configurado em api.js

export default function ListaLicitacoes() {
    const [licitacoes, setLicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchLicitacoes();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card}>
        <View>
            <Text style={styles.cardTitle}>{item.num_licitacao}</Text>
            <Text style={styles.cardSubtitle}>Objeto: {item.objeto}</Text>
            <Text>Órgão: {item.orgao}</Text>
            <Text>Data Licitação: {new Date(item.data_licitacao).toLocaleDateString()}</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
        width: '90%',
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
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#555",
    },
});
