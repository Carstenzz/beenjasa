import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, set, push } from "firebase/database"
import { Link } from "react-router-dom"
// import {collection, getDocs} from "firebase/firestore"

export default function TambahKompresor() {
    const [isloading, setloading] = useState(true)
    const [jenis, setJenis] = useState([])
    const [biaya, setBiaya] = useState([])

    console.log(jenis)
    console.log(biaya)

    useEffect(()=>{
        // postKompresor()
      },[])
    
    const postKompresor = async () => {
        const db = getDatabase(app) 
        const newDocRef = push(ref(db, "Kompresor"))
        set(newDocRef, {
            biaya : parseInt(biaya),
            jenis : jenis,
            kembali : true,
            servis : true,
        }).then(()=>{
            console.log("uploaded")
        })
    // const snapshot = await get(dbref)
    // if(snapshot.exists()){
    //     console.log(Object.values(snapshot.val()))
    //     setKompresor(Object.values(snapshot.val()))
    //     setloading(false)
    // } else {
    //     console.log("error")
    // }
    }

    const changeJenis = (e)=>{
        console.log(e.target.value)
    }

    const consthandleChange = (event) => {
        this.setState({value: event.target.value});
      }
    
    return (
        <>
        <div>
            <h1 className="font-bold text-xl">Tambah kompresor</h1>
            <div className="flex gap-2 ">
                <p>Jenis kompresor : </p>
                <input inputMode="text" className="w-60 border-2 p-1" placeholder="jenis" onChange={(e)=>{setJenis(e.target.value)}}/>
                {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
            </div>
            <div className="flex gap-2">
                <p>Harga per hari : </p>
                <input inputMode="text" className="w-60 border-2 p-1" placeholder="harga" onChange={(e)=>{setBiaya(e.target.value)}}/>
            </div>
            <Link onClick={()=>{postKompresor()}} to={"/Kompresor"}>Tambah</Link>
        </div>
        </>
    )
      
}