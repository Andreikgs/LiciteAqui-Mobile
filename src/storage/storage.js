import AsyncStorage from "@react-native-async-storage/async-storage";

async function SaveUser(usuario){
    try {
        await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
    } catch(error){
        console.log("Erro ao salvar storage");
    }
}

async function LoadUser(){
    try {
        const storage = await AsyncStorage.getItem("usuario");

        return storage ? JSON.parse(storage) : {};
    } catch(error){
        console.log("Erro ao carregar storage");
    }
}

export {SaveUser, LoadUser};