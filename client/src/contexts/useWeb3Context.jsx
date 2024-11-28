import  web3Context  from "./createWeb3Context";
import { useContext } from "react";

export const useWeb3Context = () =>{
    return useContext(web3Context)
}

//export default useWeb3Context;