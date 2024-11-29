import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";

export default function CadastroServico({ atualizarLista }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [descricao, setDescricao] = useState("");
    const { user } = useContext(AuthContext);

    const salvarServico = async () => {
        if (!descricao.trim()) {
            Alert.alert("Erro", "A descrição não pode estar vazia.");
            return;
        }
        try {
            await api.post("/tipoServico/cadastrar", {
                descricao,
                usuario: user.usuario,
            });
            Alert.alert("Sucesso", "Serviço cadastrado com sucesso!");
            setModalVisible(false);
            setDescricao("");
            atualizarLista(); // Atualiza a lista de serviços
        } catch (error) {
            console.error("Erro ao salvar serviço:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o serviço.");
        }
    };

    return (
        <View style={styles.divButton}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>Novo Serviço</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={styles.input}
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Digite a descrição"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={salvarServico}
                        >
                            <Text style={styles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    divButton: {
        marginBottom: 10,
        backgroundColor: "#f5f5f5",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
});
