import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { ImageBackground } from "react-native";
import { useContext, useEffect, useState } from "react";
import api from "../constants/api";
import { AuthContext } from "../contexts/auth";
import { SaveUser, LoadUser } from "../storage/storage";

export default props =>{
    const [valorLogin, setValorLogin] = useState("");
    const [valorSenha, setValorSenha] = useState("");
    const { setUser } = useContext(AuthContext);

    const handleLogin = async () => {           
        try {
            // Envio da requisição post para a API com o endpoint de buscar usuários com login
            const response = await api.post("/usuarios", {
                username: valorLogin,
                senha: valorSenha
            });

            if(response.data){
                // Função para salvar os dados do usuário no storage
                //await SaveUser(response.data.data);
                // Função para levar as informações do usúario ao context global
                setUser(response.data.data);
            }
            console.log(response.data);
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
    };

    // Função para carregar os dados do storage
    async function CarregarDados(){
        try {
            const usuario = await LoadUser();
            if(usuario){
                setUser(usuario);
            }

        } catch (error) {
            console.log("Erro ao carregar os dados do storage.");
        }
    }

    // Usando use effect para buscar no storage os dados de login na primeira vez que a página for carregada 
    useEffect(()=>{
        //CarregarDados();
    }, []);

    return(
        <ImageBackground
        source={require('../assets/fundo.jpeg')}
        style={estilo.background}
        >
            <View style={estilo.overlay} />
            <View style={estilo.login}>
                <Text style={estilo.titulo}>LiciteAqui</Text>
                <Text style={estilo.label}>USERNAME</Text>
                <TextInput 
                    placeholder="Usename"
                    placeholderTextColor="#979797"
                    style={estilo.input}
                    value={valorLogin}
                    onChangeText={(lgn)=>setValorLogin(lgn)}
                />
                <Text style={estilo.label}>SENHA</Text>
                <TextInput 
                    placeholder="Senha"
                    placeholderTextColor="#979797"
                    secureTextEntry={true}
                    style={estilo.input}
                    value={valorSenha}
                    onChangeText={(sn)=>setValorSenha(sn)}
                />

                <TouchableOpacity style={estilo.btn} onPress={handleLogin}>
                    <Text style={estilo.labelbtn}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>   
    )
}

const estilo = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // Ajusta a imagem para cobrir a tela toda
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Necessário para sobreposição
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Faz a sobreposição cobrir o fundo todo
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Branco translúcido
        backdropFilter: 'blur(10px)', // Aplica o desfoque (caso suporte CSS direto)
    },
    login:{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#e5eaed',
        borderWidth : 8,
        backgroundColor: 'rgb(255, 255, 255)',
        width: '80%',
        height: 400,
    },
    label:{
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        width: '78%',
        textAlign: 'left',
        color: '#878787'
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
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        width: '80%',
        padding: 10,
        marginBottom: 10

    },
    btn:{
        backgroundColor: "#FFD700",
        width: '50%',
        padding: 10,
        borderRadius: 20,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelbtn:{
        fontSize: 15,
        fontWeight: 'bold'
    },
})