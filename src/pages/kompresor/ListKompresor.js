import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
import { Link } from "react-router-dom"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function ListKompresor() {
    const [isloading, setloading] = useState(true)
    const [kompresor, setKompresor] = useState([])

    useEffect(()=>{
        fetchkompresor()
      },[])
    
    const fetchkompresor = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Kompresor")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        console.log(Object.values(snapshot.val()))
        setKompresor(Object.values(snapshot.val()))
        setloading(false)
    } else {
        console.log("error")
    }
    }
    
    if(isloading){
        return (
          <div className="w-full h-screen grid place-items-center">
            <h1 className="font-bold text-3xl">Loading</h1>
          </div>
        )
    } else{
        return (
          <>
            <div>
                <h1>Kompresor siap disewa</h1>
                <div className="flex gap-4 flex-wrap">
                {kompresor.map((kom)=>{
                  console.log("")
                    if(kom.servis) 
                        return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                })}
                </div>
            </div>
            <div>
                <h1>Kompresor belum diservice</h1>
                <div className="flex gap-4 flex-wrap">
                {kompresor.map((kom)=>{
                    if(!kom.servis && kom.kembali) 
                        return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                })}
                </div>
            </div>
            <div>
                <h1>Kompresor yang disewa</h1>
                <div className="flex gap-4 flex-wrap">
                {kompresor.map((kom)=>{
                    if(!kom.kembali) 
                        return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                })}
                </div>
            </div>
            <Link to={"tambah"}>Tambah kompressor</Link>
          </>
        )
      }
}