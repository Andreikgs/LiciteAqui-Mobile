import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { AuthContext } from '../contexts/auth';
import api from "../constants/api";

export default cliente =>{
    const [cnpj, setCnpj] = useState("");
    const [razaoSocial, setRazaoSoc] = useState("");
    const [nomeFantasia, setNomeFant] = useState("");
    const [status, setStatus] = useState("");
    const [data, setData] = useState(new Date());
    const { user } = useContext(AuthContext);
    const [servicos, setServicos] = useState([]);
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const handleCliente = async () => {  
        // console.log(formatarData(data))
        if (!cnpj || !razaoSocial || !status || !data || !user) {
             Alert.alert("Dados obrigatórios não fornecidos.");
            return;
        }
        //console.log('cnpj: ' + cnpj + " razao_social: " + razaoSocial + " nome fantasia: " + nomeFantasia + " status: " + status + " data: " + data)
        try {
            // Envio da requisição post para a API com o endpoint de cadastrar clientes
            const response = await api.post("/cliente/cadastrar", {
                cnpj: cnpj,
                razao_social: razaoSocial,
                nome_fantasia: nomeFantasia,
                status: status,
                data_cadastro : formatarData(data),
                usuario : user.usuario  
            });
        } catch (error) {
            handleContato(3); // apenas para teste enquanto o cliente n retornar 200
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

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [tipoTel, setTipoTel] = useState("");
    const [tel, setTel] = useState("");
    const [sexo, setSexo] = useState("");
    const [cpf, setCpf] = useState("");
    const [ddd, setDDD] = useState("");
    const [dataBirth, setDataBirth] = useState(new Date());
    const [showDatePickerBirth, setShowDatePickerBirth] = useState(false);
    const [servico, setServico] = useState('');

    const handleContato = async (id_cliente) => {  
        try {
            // Envio da requisição post para a API com o endpoint de cadastrar contatos
            const response = await api.post("/contatoCliente/cadastrar", {
                cliente: id_cliente,
                tipo_telefone : tipoTel,
                ddd: ddd,
                telefone: tel,
                nome_completo : nome,
                sexo : sexo ,
                data_nascimento : formatarData(dataBirth), 
                cpf : cpf,
                status_cadastro : status,
                email : email,
                usuario : user.usuario 
            });
 
            console.log(response.data);
            console.log(" Sucesso!!!");
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

    const fetchServicos = async () => {
        try {
            const response = await api.get("/tipoServico/listar");
            setServicos(response.data);
        } catch (error) {
            // Log completo para depuração
            console.log("Erro completo:", error);
    
            if (error.response?.data?.message) {
                // Exibe a mensagem de erro retornada pela API
                Alert.alert(error.response.data.message);
            } else {
                Alert.alert("Ocorreu um erro.");
            }
        }
    }

    const formatarData = (data) => {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês inicia em 0
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    const formatarCPF = (texto) => {
        let value = texto.replace(/\D/g, '');

        // if (value.length > 11) {
        //     value = value.substring(0, 11);
        // }

        // if (value.length > 0) {
        //     value = value.replace(/(\d{3})(\d)/, '$1.$2');
        // }

        // if (value.length > 7) {
        //     value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        // }

        // if (value.length > 11) {
        //     value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        // }

         setCpf(value);
    };

    const formatarCNPJ = (texto) => {
        let value = texto.replace(/\D/g, '');

        // if (value.length > 14) {
        //     value = value.substring(0, 14);
        // }

        // if (value.length > 2) {
        //     value = value.replace(/(\d{2})(\d)/, '$1.$2');
        // }

        // if (value.length > 6) {
        //     value = value.replace(/(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        // }

        // if (value.length > 10) {
        //     value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4');
        // }

        // if (value.length > 14) {
        //     value = value.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
        // }

        setCnpj(value);
    };

    useEffect(()=> {
        fetchServicos();
    }, [])

    return(
        <View style={estilo.container}>
            <ScrollView contentContainerStyle={estilo.scroll} showsVerticalScrollIndicator={false}>
                <Text style={estilo.titulo}>Adicionar Cliente</Text>
                <Text style={estilo.label}>CNPJ</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cnpj}
                    onChangeText={(cnpj)=>formatarCNPJ(cnpj)}
                />
                <Text style={estilo.description}>Insira o CNPJ do cliente.</Text>
                <Text style={estilo.label}>Razão Social</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={razaoSocial}
                    onChangeText={(razaoSocial)=>setRazaoSoc(razaoSocial)}
                />
                <Text style={estilo.description}>Informe a Razão Social do cliente.</Text>
            
                <Text style={estilo.label}>Nome Fantasia</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={nomeFantasia}
                    onChangeText={(nomeFantasia)=>setNomeFant(nomeFantasia)}
                />
                <Text style={estilo.description}>Informe o Nome Fantasia.</Text>
            
                <Text style={estilo.label}>Serviço</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={servico}
                        onValueChange={(value) => setServico(value)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Selecione um serviço" value="" />
                        {servicos.map((servico) => (
                            <Picker.Item
                                key={servico.id_tipo_servico} // Corrigido para usar o identificador correto
                                label={servico.descricao} // Exibe a descrição do serviço
                                value={servico.id_tipo_servico} // Envia o ID do serviço ao selecionar
                            />
                        ))}
                    </Picker>
                </View>
                <Text style={estilo.description}>Informe o tipo de serviço do cliente.</Text>

                <Text style={estilo.label}>Status</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(status) => setStatus(status)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Ativo" value="1" />
                        <Picker.Item label="Inativo" value="2" />
                        <Picker.Item label="Suspenso" value="3" />
                    </Picker>
                </View>
                <Text style={estilo.description}>Informe o Status do cliente.</Text>

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

                <Text style={estilo.titulo}>Adicionar Contato</Text>

                <Text style={estilo.label}>Nome Completo</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={nome}
                    onChangeText={(nome)=>setNome(nome)}
                />
                <Text style={estilo.description}>Insira o nome completo do contato.</Text>
                
                <Text style={estilo.label}>E-mail</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={email}
                    onChangeText={(email)=>setEmail(email)}
                />
                <Text style={estilo.description}>Insira o E-mail de contato.</Text>
                    

                <Text style={estilo.label}>Tipo de Telefone</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={tipoTel}
                    onChangeText={(tipoTel)=>setTipoTel(tipoTel)}
                />
                <Text style={estilo.description}>Insira o tipo de Telefone do contato.</Text>

                <Text style={estilo.label}>DDD</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={ddd}
                    onChangeText={(ddd)=>setDDD(ddd)}
                />
                <Text style={estilo.description}>Insira o DDD do número de telefone.</Text>

                <Text style={estilo.label}>Telefone</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={tel}
                    onChangeText={(tel)=>setTel(tel)}
                />
                <Text style={estilo.description}>Insira o número do telefone.</Text>

                <Text style={estilo.label}>Sexo</Text>
                <View style={estilo.input}>
                    <Picker
                        selectedValue={sexo}
                        onValueChange={(value) => setSexo(value)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Masculino" value="Masculino" />
                        <Picker.Item label="Feminino" value="Feminino" />
                    </Picker>
                </View>
                <Text style={estilo.description}>Informe o gênero do contato.</Text>

                <View style={estilo.input}>
                    <Text onPress={() => setShowDatePickerBirth(true)}>
                        DATA: {data.toLocaleDateString("pt-BR") || "Selecionar Data"}
                    </Text>
                    {showDatePickerBirth && (
                        <DateTimePicker
                            value={data}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePickerBirth(false);
                                if (selectedDate) setDataBirth(selectedDate);
                            }}
                        />
                    )}
                </View>
                <Text style={estilo.description}>Selecione a hora.</Text>

                <Text style={estilo.label}>CPF</Text>
                <TextInput
                    placeholder=""
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cpf}
                    onChangeText={(cpf)=>formatarCPF(cpf)}
                />
                <Text style={estilo.description}>Insira o CPF do contato.</Text>
                
                <TouchableOpacity style={estilo.btn} onPress={handleCliente}>
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