import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import dashboard from "../pages/dashboard";
import licitacao from "../pages/licitacao";
import cliente from "../pages/cliente";
import clientesLista from "../pages/clientesLista";
import licitacoesLista from "../pages/licitacoesLista";

const Drawer = createDrawerNavigator();

export default props =>(
    <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer.Navigator
                initialRouteName="DashBoard"
                screenOptions={{headerShown:true}}
            >
                <Drawer.Screen name="DashBoard" component={dashboard}/>
                <Drawer.Screen name="Criar licitação" component={licitacao}/>
                <Drawer.Screen name="Minhas Licitações" component={licitacoesLista}/>
                <Drawer.Screen name="Adicionar Cliente" component={cliente}/>
                <Drawer.Screen name="Lista de Clientes" component={clientesLista}/>

            </Drawer.Navigator>
        </GestureHandlerRootView>
    </NavigationContainer>
)

