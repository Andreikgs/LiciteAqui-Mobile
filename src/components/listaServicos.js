import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from "react-native";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";

export default function ListaServicos({ servicos, atualizarLista }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedServico, setSelectedServico] = useState(null);
    const { user } = useContext(AuthContext);

    const salvarEdicao = async () => {
        if (!selectedServico || !selectedServico.descricao) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }
        try {
            await api.put("/tipoServico/atualizar", {
                id_tipo_servico: selectedServico.id_tipo_servico,
                descricao: selectedServico.descricao,
                usuario: user.usuario,
            });
            Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
            setModalVisible(false);
            atualizarLista();
        } catch (error) {
            console.error("Erro ao atualizar serviço:", error);
            Alert.alert("Erro", "Não foi possível atualizar o serviço.");
        }
    };

    const deletarServico = async () => {
        if (!selectedServico) {
            Alert.alert("Erro", "Houve um erro ao selecionar o serviço.");
            return;
        }
        try {
            await api.delete("/tipoServico/deletar", {
                data: {
                    id_tipo_servico: selectedServico.id_tipo_servico,
                    usuario: user.usuario,
                },
            });
            Alert.alert("Sucesso", "Serviço deletado com sucesso!");
            setDeleteModalVisible(false);
            atualizarLista();
        } catch (error) {
            console.error("Erro ao deletar serviço:", error);
            Alert.alert("Erro", "Não foi possível deletar o serviço.");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={servicos}
                keyExtractor={(item) => item.id_tipo_servico.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}
                        onPress={() => {
                            setSelectedServico(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.name}>{item.descricao}</Text>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: "#FF6347" }]}
                                onPress={() => {
                                    setSelectedServico(item);
                                    setDeleteModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.info}>Sem serviços cadastrados.</Text>}
            />
            
            {/* Modal de Edição */}
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
                            value={selectedServico?.descricao || ""}
                            onChangeText={(text) =>
                                setSelectedServico({ ...selectedServico, descricao: text })
                            }
                            placeholder="Digite a descrição"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={salvarEdicao}
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

            {/* Modal de Confirmação de Exclusão */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                        <Text style={styles.label}>
                            Tem certeza que deseja excluir o serviço "{selectedServico?.descricao}"?
                        </Text>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#FF6347" }]}
                            onPress={deletarServico}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
                            onPress={() => setDeleteModalVisible(false)}
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
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        marginTop: 10,
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
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    info: {
        textAlign: "center",
        color: "#555",
    },
});
