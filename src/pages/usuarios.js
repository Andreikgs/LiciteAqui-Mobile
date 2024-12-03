import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { AuthContext } from '../contexts/auth';
import api from "../constants/api";

export default cliente =>{
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [sexo, setSexo] = useState("");
    const [data, setData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const { user } = useContext(AuthContext);

    const handleUsuario = async function(){
        try {
            const response = await api.post("user/cadastrar", {
                nome_completo : nome,
                email : email,
                sexo : sexo, 
                data_nascimento : data, 
                cpf : cpf, 
                usuario : user.usuario
            });

            const lastInsertId = response.data.data.id_usuario;
            handleLogin(lastInsertId);
        } catch (error) {
            if (error.response?.data?.message) {
                // Exibe a mensagem de erro retornada pela API
                Alert.alert(error.response.data.message);
            } else {
                Alert.alert("Ocorreu um erro. Tente novamente mais tarde.");
            }
        }
    }

    const handleLogin = async function(lastInsertId){
        try {
            const response = api.post("/login/cadastrar",{
                usuario : lastInsertId,
                username : username,
                senha : senha,
                usuario_log : user.usuario
            });
            Alert.alert("Cadastro de novo login e usuário feito com sucesso!");
        } catch (error) {
            if (error.response?.data?.message) {
                // Exibe a mensagem de erro retornada pela API
                Alert.alert(error.response.data.message);
            } else {
                Alert.alert("Ocorreu um erro. Tente novamente mais tarde.");
            }
        }
    };

    return(
        <View style={estilo.container}>
            <ScrollView contentContainerStyle={estilo.scroll} showsVerticalScrollIndicator={false}>
                <Text style={estilo.titulo}>Adicionar Usuário</Text>

                <Text style={estilo.label}>Nome Completo</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={nome}
                    onChangeText={(nome)=>{setNome(nome)}}
                />
                <Text style={estilo.description}>Insira o nome completo do usuário.</Text>
                
                <Text style={estilo.label}>CPF</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cpf}
                    onChangeText={(cpf)=>{setCpf(cpf)}}
                />
                <Text style={estilo.description}>Insira o CPF do usuário.</Text>

                <Text style={estilo.label}>E-mail</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={email}
                    onChangeText={(email)=>{setEmail(email)}}
                />
                <Text style={estilo.description}>Insira o e-mail do usuário.</Text>

                <Text style={estilo.label}>Sexo</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={sexo}
                        onValueChange={(sexo) => setSexo(sexo)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Masculino" value="Masculino" />
                        <Picker.Item label="Feminino" value="Feminino" />
                    </Picker>
                </View>
                <Text style={estilo.description}>Informe o gênero do usuário.</Text>

                <Text style={estilo.label}>Data de nascimento:</Text>
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
                <Text style={estilo.description}>Informe a data nascimento.</Text>

                <Text style={estilo.titulo}>Informações de Login</Text>
                
                <Text style={estilo.label}>Username</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={username}
                    onChangeText={(username)=>{setUsername(username)}}
                />
                <Text style={estilo.description}>Insira o username usuário.</Text>
                
                <Text style={estilo.label}>Senha</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={senha}
                    onChangeText={(senha)=>{setSenha(senha)}}
                />
                <Text style={estilo.description}>Insira a senha do usuário.</Text>

                <TouchableOpacity style={estilo.btn} onPress={handleUsuario}>
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
    labelbtn:{
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
    picker: {
        height: 50,
        width: "100%",
    },
});