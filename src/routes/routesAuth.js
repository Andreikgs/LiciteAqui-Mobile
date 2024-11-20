import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import dashboard from "../pages/dashboard";

const Drawer = createDrawerNavigator();

export default props =>(
    <NavigationContainer>
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer.Navigator
                initialRouteName="DashBoard"
                screenOptions={{headerShown:false}}
            >
                <Drawer.Screen name="DashBoard" component={dashboard}/>
            </Drawer.Navigator>
        </GestureHandlerRootView>
    </NavigationContainer>
)

