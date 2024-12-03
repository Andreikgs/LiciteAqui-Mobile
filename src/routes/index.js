import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import login from "../pages/login";
import dashboard from "../pages/dashboard";
import licitacao from "../pages/licitacao";

const Drawer = createDrawerNavigator();


export default props =>(
    <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer.Navigator
                initalRouteName="Login"
                screenOptions={{headerShown:false}}
            >
                <Drawer.Screen name="Login" component={login} options={{swipeEnabled: false, drawerLockMode: 'locked-closed', drawerItemStyle: { display: 'none' },}}/>
                <Drawer.Screen name="DashBoard" component={dashboard}/>
                <Drawer.Screen name="Licitação" component={licitacao}/>
            </Drawer.Navigator>
        </GestureHandlerRootView>
    </NavigationContainer>
    
)