import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const App = () => {
    const [data, setData] = useState([]);
    const [statesData, setStatesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGeneralData = async () => {
        try {
            const response = await fetch('http://192.168.2.110:5000/analise_licitacoes'); // Substitua pelo IP do seu backend
            const json = await response.json();
            setData(json);
        } catch (err) {
            Alert.alert("Erro", "Erro ao carregar os dados gerais");
        }
    };

    const fetchStatesData = async () => {
        try {
            const response = await fetch('http://192.168.2.110:5000/analise_licitacoes_estados'); // Substitua pelo IP do seu backend
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

    // Preparar dados para o gráfico de pizza
    const pieChartData = statesData.map((item, index) => ({
        name: item.estado,
        population: item.total_vencida, // Substitua por outra métrica se necessário
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    }));

    const pieChartData2 = statesData.map((item, index) => ({
        name: item.estado,
        population: item.total_derrota, // Substitua por outra métrica se necessário
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    }));

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.title}>Análise Geral</Text>
            <View style={styles.card}>
                <Text style={styles.text}>Total de Licitações: {data.total_licitacoes}</Text>
                <Text style={styles.text}>Vencidas: {data.total_vencida}</Text>
                <Text style={styles.text}>Derrotas: {data.total_derrota}</Text>
                <Text style={styles.text}>% Vencidas: {data.porcentagem_vencida}%</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Vitórias por Estado</Text>
                <PieChart
                    data={pieChartData}
                    width={screenWidth - 40} // Tamanho do gráfico
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                <Text style={styles.title}>Derrotas por Estado</Text>
                <PieChart
                    data={pieChartData2}
                    width={screenWidth - 40} // Tamanho do gráfico
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        </ScrollView>
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
