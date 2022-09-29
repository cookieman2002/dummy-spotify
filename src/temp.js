import tokenContext from "./tokenContext";
import {useContext} from "react"

const Temp = () => {
    const {token} = useContext(tokenContext) 
    return ( <>
    {token}
    </> );
}
 
export default Temp;