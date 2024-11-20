import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";


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

    return(
        <View style={estilo.container}>
            <ScrollView 
            contentContainerStyle={estilo.scroll}
            showsVerticalScrollIndicator={false}
            >
                <TextInput
                    placeholder="Orgão"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={orgao}
                    onChangeText={(org)=>setOrgao(org)}
                />
                <TextInput
                    placeholder="Cliente"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cliente}
                    onChangeText={(cli)=>setCliente(cli)}
                />
                <View style={estilo.input}>
                    <Picker
                        selectedValue={modalidade}
                        onValueChange={(mod) => setModalidade(mod)}
                        style={estilo.picker}
                    >
                        <Picker.Item label="Modalidade" value="" />
                        <Picker.Item label="Pregão Eletronico" value="PE" />
                        <Picker.Item label="Pregão Presencial" value="PP" />
                        <Picker.Item label="Tomada De Preço" value="TP" />
                        <Picker.Item label="Concorrencia" value="CO" />
                        <Picker.Item label="Convite" value="CV" />
                        <Picker.Item label="Concurso" value="CN" />
                        <Picker.Item label="Leilão" value="LE" />
                        <Picker.Item label="Dialogo Competitivo" value="DC" />
                    </Picker>
                </View>
                <TextInput
                    placeholder="N° Licitação"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={numLicita}
                    onChangeText={(num)=>setNumLicita(num)}
                />
                <TextInput
                    placeholder="Portal"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={portal}
                    onChangeText={(por)=>setPortal(por)}
                />
                <TextInput
                    placeholder="Cod Indentificação"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={codIdentifica}
                    onChangeText={(cod)=>setCodIdentifica(cod)}
                />
                <TextInput
                    placeholder="Objeto"
                    placeholderTextColor="#000"
                    multiline={true}
                    numberOfLines={4}
                    style={estilo.input}
                    value={objeto}
                    onChangeText={(obj)=>setObjeto(obj)}
                />

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

                <TextInput
                    placeholder="Cidade"
                    placeholderTextColor="#000"
                    style={estilo.input}
                    value={cidade}
                    onChangeText={(cid)=>setCidade(cid)}
                />

                
                
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
        paddingTop: 60,
        paddingBottom: 60,
    },
    input:{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#aaa',
        borderRadius: 10,
        width: 300,
        height: 60,
        marginBottom: 20,
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
})