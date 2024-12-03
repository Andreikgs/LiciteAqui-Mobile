import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const App = () => {
    const [data, setData] = useState([]);
    const [statesData, setStatesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGeneralData = async () => {
        try {
            const response = await fetch('http://10.136.32.131:5000/analise_licitacoes'); // Substitua pelo IP do seu backend
            const json = await response.json();
            setData(json);
        } catch (err) {
            Alert.alert("Erro", "Erro ao carregar os dados gerais");
        }
    };

    const fetchStatesData = async () => {
        try {
            const response = await fetch('http://10.136.32.131:5000/analise_licitacoes_estados'); // Substitua pelo IP do seu backend
            const json = await response.json();
            setStatesData(json);
        } catch (err) {
            Alert.alert("Erro", "Erro ao carregar os dados por estado");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchGeneralData(), fetchStatesData()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Análise Geral</Text>
            <View style={styles.card}>
                <Text style={styles.text}>Total de Licitações: {data.total_licitacoes}</Text>
                <Text style={styles.text}>Vencidas: {data.total_vencida}</Text>
                <Text style={styles.text}>Derrotas: {data.total_derrota}</Text>
                <Text style={styles.text}>% Vencidas: {data.porcentagem_vencida}%</Text>
            </View>

            <Text style={styles.title}>Análise por Estado</Text>
            <FlatList
                data={statesData}
                keyExtractor={(item) => item.estado}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>Estado: {item.estado}</Text>
                        <Text style={styles.text}>Vencidas: {item.total_vencida}</Text>
                        <Text style={styles.text}>Derrotas: {item.total_derrota}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#343a40',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    text: {
        fontSize: 16,
        color: '#495057',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
