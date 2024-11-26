import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import api from '../constants/api';
import { useContext } from "react";
import { AuthContext } from '../contexts/auth';

export default licitacao =>{
    const [orgao, setOrgao] = useState("");
    const [cliente, setCliente] = useState("");
    const [modalidade, setModalidade] = useState("");
    const [numLicita, setNumLicita] = useState("");
    const [portal, setPortal] = useState("");
    const [codIdentifica, setCodIdentifica] = useState("");
    const [objeto, setObjeto] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [data, setData] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const { user } = useContext(AuthContext);

    const formatarData = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês inicia em 0
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    const handleLicitacao = async () => {
        try {
            if (!numLicita || !modalidade || !orgao || !portal || !codIdentifica  || !objeto || !cidade || !estado || !data) {
                Alert.alert("Erro", "Dados obrigatórios não fornecidos.");
                return;
            }
            // Envio da requisição post para a API com o endpoint de cadastrar licitacap
            const response = await api.post("/licitacao/cadastrar", {
                num_licitacao: numLicita,
                modalidade: modalidade,
                orgao: orgao,
                portal: portal,
                numero_identificacao : codIdentifica,
                status_licitacao : 1,
                objeto : objeto,
                cidade : cidade,
                estado : estado,
                data_licitacao : formatarData(data),
                usuario : user.usuario
            });
            // console.log(response.data);
        } catch (error) {
            // Log completo para depuração
            console.log("Erro completo:", error);
    
            if (error.response?.data?.message) {
                // Exibe a mensagem de erro retornada pela API
                Alert.alert(error.response.data.message);
            } else {
                Alert.alert("Ocorreu um erro. Tente novamente mais tarde.");
            }
        }
    }

    return(
        <View style={estilo.container}>
            <ScrollView 
            contentContainerStyle={estilo.scroll}
            showsVerticalScrollIndicator={false}
            >
                <Text style={estilo.titulo}>Criar Licitação</Text>
                <Text style={estilo.label}>Orgão</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={orgao}
                    onChangeText={(org)=>setOrgao(org)}
                />
                <Text style={estilo.description}>Informe o órgão responsável.</Text>
                <Text style={estilo.label}>Cliente</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cliente}
                    onChangeText={(cli)=>setCliente(cli)}
                />
                <Text style={estilo.description}>Informe o cliente.</Text>

                <Text style={estilo.label}>Modalidade</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={modalidade}
                        onValueChange={(mod) => setModalidade(mod)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Modalidade" value="" />
                        <Picker.Item label="Pregão Eletronico" value="1" />
                        {/* <Picker.Item label="Pregão Presencial" value="PP" /> */}
                        <Picker.Item label="Tomada De Preços" value="3" />
                        <Picker.Item label="Concorrencia" value="2" />
                        {/* <Picker.Item label="Convite" value="CV" /> */}
                        {/* <Picker.Item label="Concurso" value="CN" /> */}
                        {/* <Picker.Item label="Leilão" value="LE" /> */}
                        {/* <Picker.Item label="Dialogo Competitivo" value="DC" /> */}
                    </Picker>
                </View>
                <Text style={estilo.description}>Selecione uma modalidade.</Text>
                <Text style={estilo.label}>N° Licitação</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={numLicita}
                    onChangeText={(num)=>setNumLicita(num)}
                />
                <Text style={estilo.description}>Informe o N° Licitação.</Text>

                <Text style={estilo.label}>Portal</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={portal}
                    onChangeText={(por)=>setPortal(por)}
                />
                <Text style={estilo.description}>Informe o portal.</Text>

                <Text style={estilo.label}>Cod Indentificação</Text>               
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={codIdentifica}
                    onChangeText={(cod)=>setCodIdentifica(cod)}
                />
                <Text style={estilo.description}>Insira o código de Indentificação.</Text>

                <Text style={estilo.label}>Objeto</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    multiline={true}
                    numberOfLines={4}
                    style={estilo.input}
                    value={objeto}
                    onChangeText={(obj)=>setObjeto(obj)}
                />
                <Text style={estilo.description}>Informe o objeto.</Text>

                <Text style={estilo.label}>Data</Text>
                <View style={estilo.input}>
                    <Text onPress={() => setShowDatePicker(true)}>
                        DATA: {data.toLocaleDateString("pt-BR") || "Selecionar Data"}
                    </Text>
                    {showDatePicker && (
                        <DateTimePicker
                            value={data}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setData(selectedDate);
                            }}
                        />
                    )}
                </View>
                <Text style={estilo.description}>Selecione a data.</Text>

                <Text style={estilo.label}>Hora</Text>
                <View style={estilo.input}>
                    <Text onPress={() => setShowTimePicker(true)}>
                        HORA: {hora.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) || "Selecionar Hora"}
                    </Text>
                    {showTimePicker && (
                        <DateTimePicker
                            value={hora}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                setShowTimePicker(false);
                                if (selectedTime) setHora(selectedTime);
                            }}
                        />
                    )}
                </View>
                <Text style={estilo.description}>Selecione a hora.</Text>

                <Text style={estilo.label}>Estado</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={estado}
                        onValueChange={(value) => setEstado(value)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Estado" value="" />
                        <Picker.Item label="Acre (AC)" value="AC" />
                        <Picker.Item label="Alagoas (AL)" value="AL" />
                        <Picker.Item label="Amapá (AP)" value="AP" />
                        <Picker.Item label="Amazonas (AM)" value="AM" />
                        <Picker.Item label="Bahia (BA)" value="BA" />
                        <Picker.Item label="Ceará (CE)" value="CE" />
                        <Picker.Item label="Distrito Federal (DF)" value="DF" />
                        <Picker.Item label="Espírito Santo (ES)" value="ES" />
                        <Picker.Item label="Goiás (GO)" value="GO" />
                        <Picker.Item label="Maranhão (MA)" value="MA" />
                        <Picker.Item label="Mato Grosso (MT)" value="MT" />
                        <Picker.Item label="Mato Grosso do Sul (MS)" value="MS" />
                        <Picker.Item label="Minas Gerais (MG)" value="MG" />
                        <Picker.Item label="Pará (PA)" value="PA" />
                        <Picker.Item label="Paraíba (PB)" value="PB" />
                        <Picker.Item label="Paraná (PR)" value="PR" />
                        <Picker.Item label="Pernambuco (PE)" value="PE" />
                        <Picker.Item label="Piauí (PI)" value="PI" />
                        <Picker.Item label="Rio de Janeiro (RJ)" value="RJ" />
                        <Picker.Item label="Rio Grande do Norte (RN)" value="RN" />
                        <Picker.Item label="Rio Grande do Sul (RS)" value="RS" />
                        <Picker.Item label="Rondônia (RO)" value="RO" />
                        <Picker.Item label="Roraima (RR)" value="RR" />
                        <Picker.Item label="Santa Catarina (SC)" value="SC" />
                        <Picker.Item label="São Paulo (SP)" value="SP" />
                        <Picker.Item label="Sergipe (SE)" value="SE" />
                        <Picker.Item label="Tocantins (TO)" value="TO" />
                    </Picker>
                </View>
                <Text style={estilo.description}>Selecione o Estado da licitação.</Text>

                <Text style={estilo.label}>Cidade</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cidade}
                    onChangeText={(cid)=>setCidade(cid)}
                />
                <Text style={estilo.description}>Selecione a cidade da licitação.</Text>

                <TouchableOpacity style={estilo.btn} onPress={()=>{handleLicitacao()}}>
                    <Text style={estilo.labelbtn}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        
    )
}

const estilo = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0E0E0'
    },
    scroll:{
        marginVertical:30,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    titulo:{
        fontSize: 27,
        fontWeight: 'bold',
        marginBottom: 35,
        width: '100%',
        textAlign: 'center',
        color: '#878787'
    },
    input:{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 10,
        width: 300,
        height: 60,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        width: 300,
        padding: 10,
        marginBottom: 8
    },
    pickerContainer: {
        marginBottom: 20,
        backgroundColor: "#aaa",
        borderRadius: 10,
        width: 300,
    },
    picker: {
        height: 50,
        width: "100%",
    },
    label:{
        fontSize: 14,
        fontWeight: 'bold',
        width: '78%',
        marginBottom: 10,
        textAlign: 'left',
        color: '#878787'
    },
    description : {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 20,
        width: '78%',
        textAlign: 'left',
        color: '#878787' 
    },labelbtn:{
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    btn:{
        backgroundColor: "rgb(170, 209, 120)",
        width: '100%',
        padding: 20,
        borderRadius: 10,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})