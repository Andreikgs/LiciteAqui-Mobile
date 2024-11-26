import { StyleSheet, Text, View } from "react-native"
import ListaClientes  from "../components/listaClientes";

export default props=>{

    return(
        <View style={estilo.container}>
            <ListaClientes style={estilo.listaClientes} />
        </View>
    )
}


const estilo = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
    },
})