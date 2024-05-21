import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
import { Link } from "react-router-dom"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function ListPelanggan() {
    const [isloading, setloading] = useState(true)
    const [pelanggan, setPelanggan] = useState([])

    useEffect(()=>{
        fetchPelanggan()
      },[])
    
    const fetchPelanggan = async () => {
      const db = getDatabase(app)
      const dbref = ref(db, "Pelanggan")
      const snapshot = await get(dbref)
      if(snapshot.exists()){
          console.log(Object.values(snapshot.val()))
          setPelanggan(Object.values(snapshot.val()))
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
                <h1>Pelanggan yang di blacklist</h1>
                <div className="flex gap-4 flex-wrap">
                {pelanggan.map((plg)=>{
                    if(plg.blacklist) 
                        return (
                            <Link to={"/detail-pelanggan/" + plg.nama.replace(/\s+/g, '-').toLowerCase()} className="border-2 border-gray-400">
                                <p>Nama : {plg.nama}</p>
                                <p>No hp : {plg.no_hp}</p>
                                <p>Alamat : {plg.alamat}</p>
                            </Link>
                        )
                })}
                </div>
            </div>
            <div>
                <h1>Pelanggan Lain</h1>
                <div className="flex gap-4 flex-wrap">
                {pelanggan.map((plg)=>{
                    if(!plg.blacklist) 
                        return (
                            <Link to={"/detail-pelanggan/" + plg.nama.replace(/\s+/g, '-').toLowerCase()} className="border-2 border-gray-400">
                                <p>Nama : {plg.nama}</p>
                                <p>No hp : {plg.no_hp}</p>
                                <p>Alamat : {plg.alamat}</p>
                            </Link>
                        )
                })}
                </div>
            </div>
          </>
        )
      }
}