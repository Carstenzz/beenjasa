import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
import { Link } from "react-router-dom"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function ListTransaksi() {
    const [isloading, setloading] = useState(true)
    const [transaksi, setTransaksi] = useState([])
    const [transaksiKeys, setTransaksiKeys] = useState([])

    useEffect(()=>{
        fetchPelanggan()
      },[])
    
    const fetchPelanggan = async () => {
      const db = getDatabase(app)
      const dbref = ref(db, "Transaksi")
      const snapshot = await get(dbref)
      if(snapshot.exists()){
          console.log(Object.values(snapshot.val()))
          setTransaksi(Object.values(snapshot.val()))
          setTransaksiKeys(Object.keys(snapshot.val()))
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
                <h1>Kompresor yang sedang keluar</h1>
                <div className="flex gap-4 flex-wrap">
                {transaksi.map((tran, index)=>{
                if(!tran.kembali){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2">
                        <h1>{tran.kompresor}</h1>
                        <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}>penyewa : {tran.nama}</Link>
                        <p>no hp : {tran.no_hp}</p>
                        <p>tanggal sewa : {tran.tanggal_sewa}</p>
                        <p>rencana sewa : {tran.lama_sewa}</p>
                        <Link to={"/detail-transaksi/" + transaksiKeys[index]}>selengkapnya</Link>
                    </div>
                    )
                    }
                })}
                </div>
            </div>
            <div>
                <h1>Kompresor yang sudah kembali tetapi belum lunas</h1>
                <div className="flex gap-4 flex-wrap">
                {transaksi.map((tran, index)=>{
                if(tran.kembali && !tran.lunas){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2">
                        <h1>{tran.kompresor}</h1>
                        <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}>penyewa : {tran.nama}</Link>
                        <p>no hp : {tran.no_hp}</p>
                        <p>tanggal sewa : {tran.tanggal_sewa}</p>
                        <p>rencana sewa : {tran.lama_sewa}</p>
                        <Link to={"/detail-transaksi/" + transaksiKeys[index]}>selengkapnya</Link>
                    </div>
                    )
                    }
                })}
                </div>
            </div>
            <div>
                <h1>Transaksi lainnya</h1>
                <div className="flex gap-4 flex-wrap">
                {transaksi.map((tran, index)=>{
                if(tran.kembali && tran.lunas){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2">
                        <h1>{tran.kompresor}</h1>
                        <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}>penyewa : {tran.nama}</Link>
                        <p>no hp : {tran.no_hp}</p>
                        <p>tanggal sewa : {tran.tanggal_sewa}</p>
                        <p>rencana sewa : {tran.lama_sewa}</p>
                        <Link to={"/detail-transaksi/" + transaksiKeys[index]}>selengkapnya</Link>
                    </div>
                    )
                    }
                })}
                </div>
            </div>
          </>
        )
      }
}