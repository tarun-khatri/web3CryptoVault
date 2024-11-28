import UploadImage from "../components/UploadImage"
import GetImage from "../components/GetImage"
import { useState } from "react"


const Home = ()=>{
    const [reload, setReload] = useState(false)

    const reloadEffects = ()=>{
        setReload(!reload)
    }

    return(
        <div className="relative h-full w-screen flex flex-col justify-center items-center mt-8 px-4 ">
            <UploadImage reloadEffects={reloadEffects}/>
            <GetImage reload={reload}/>
        </div>
        
    )
}

export default Home