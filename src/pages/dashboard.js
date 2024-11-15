import { StyleSheet, Text, View } from "react-native"


export default props=>{
    

    return(
        <View style={estilo.container}>
            <Text>Teste</Text>
        </View>
    )
}


const estilo = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})