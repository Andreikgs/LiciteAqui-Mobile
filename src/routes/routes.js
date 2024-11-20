import RoutesOpen from './routesOpen';
import RoutesAuth from './routesAuth';
import { useContext } from "react";
import { AuthContext } from '../contexts/auth';

function Routes(){
    const { user } = useContext(AuthContext);
    // regrinha para verificar se o usuário está autenticado e pode entrar no sistema
    return user.usuario ? <RoutesAuth/> : <RoutesOpen/> ;
}

export default Routes;