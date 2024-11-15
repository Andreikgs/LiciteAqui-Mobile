import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native"
import { ImageBackground } from "react-native"
import { useState } from "react"


export default props =>{
    const [valorLogin, setValorLogin] = useState("");
    const [valorSenha, setValorSenha] = useState("");

    return(
        <ImageBackground
        source={require('../assets/fundo.jpeg')}
        style={estilo.background}
        >
            <View style={estilo.login}>
                <Text style={estilo.label}>LOGIN</Text>
                <TextInput 
                    placeholder="Login"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={valorLogin}
                    onChangeText={(lgn)=>setValorLogin(lgn)}
                />
                <Text style={estilo.label}>SENHA</Text>
                <TextInput 
                    placeholder="Senha"
                    placeholderTextColor="#000"
                    secureTextEntry={true}
                    style={estilo.input}
                    value={valorSenha}
                    onChangeText={(sn)=>setValorSenha(sn)}
                />

                <TouchableOpacity
                    style={estilo.btn}
                    onPress={() => props.navigation.navigate('DashBoard')}
                >
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
    },
    login:{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: 250,
        height: 300,
    },
    label:{
        fontSize: 25,
        fontWeight: 'bold'
    },
    input:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#aaa',
        borderRadius: 10,
        width: '70%'
    },
    btn:{
        backgroundColor: "#FFD700",
        width: '50%',
        padding: 10,
        borderRadius: 20,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelbtn:{
        fontSize: 15,
        fontWeight: 'bold'
    },
})