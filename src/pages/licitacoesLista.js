import { StyleSheet, Text, View } from "react-native"
import ListaLicitacoes  from "../components/listaLicitacoes";

export default props=>{
    

    return(
        <View style={estilo.container}>
            <ListaLicitacoes />
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