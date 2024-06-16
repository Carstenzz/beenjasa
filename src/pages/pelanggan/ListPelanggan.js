import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
import { Link } from "react-router-dom"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function ListPelanggan() {
    const [isloading, setloading] = useState(true)
    const [pelanggan, setPelanggan] = useState([])
    const [blacklist, setBlacklist] = useState(false)
    const [transaksi, setTransaksi] = useState([])
    useEffect(()=>{
        fetchTransaksi()
        fetchPelanggan()
      },[])
    
    const fetchPelanggan = async () => {
      const db = getDatabase(app)
      const dbref = ref(db, "Pelanggan")
      const snapshot = await get(dbref)
      if(snapshot.exists()){
          console.log(Object.values(snapshot.val()))
          setPelanggan(Object.values(snapshot.val()))
          Object.values(snapshot.val()).forEach(e=>{
            if(e.blacklist) setBlacklist(true)
          })
          setloading(false)
      } else {
          console.log("error")
      }
    }

    const fetchTransaksi = async () => {
      const db = getDatabase(app)
      const dbref = ref(db, "Transaksi")
      const snapshot = await get(dbref)
      if(snapshot.exists()){
          let trans = []
          let index = 0
          Object.values(snapshot.val()).forEach((e)=>{
            if(!e['kembali']){
              trans[index] = e
              index++
            }
          })
          setTransaksi(trans)
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
            <h1 className="my-6 text-center text-3xl font-bold">PELANGGAN YANG SEDANG MENYEWA</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {transaksi.map((tran)=>{
              return(
                pelanggan.map((pel)=>{
                  if(pel.nik == tran.nik){
                    return(
                      <Link to={"/detail-pelanggan/" + pel.nama.replace(/\s+/g, '-').toLowerCase()}>
                      <div className="border-2 border-gray-400 p-4">
                        <h1 className="font-bold text-xl text-center pb-4">{pel.nama}</h1>
                        <div className="px-2 pb-4">
                          <table>
                            <tr>
                              <td>Nomor HP </td>
                              <td> : </td>
                              <td> {pel.no_hp}</td>
                            </tr>
                            <tr>
                              <td>Alamat </td>
                              <td> : </td>
                              <td> {pel.alamat}</td>
                            </tr>
                            <tr>
                              <td className="pr-2">Kompresor yang disewa </td>
                              <td className="pr-2"> : </td>
                              <td> {tran.jenis}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      </Link>
                    )
                  }
                })
              )
            })}
            </div> 
            {blacklist &&
            <>
            <h1 className="my-6 text-center text-3xl font-bold">PELANGGAN YANG DIBLACKLIST</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {pelanggan.map((pel)=>{
                if(pel.blacklist){
                  return(
                    <Link to={"/detail-pelanggan/" + pel.nama.replace(/\s+/g, '-').toLowerCase()}>
                    <div className="border-2 border-gray-400 p-4">
                      <h1 className="font-bold text-xl text-center pb-4">{pel.nama}</h1>
                      <div className="px-2 pb-4">
                        <table>
                          <tr>
                            <td className="pr-2">Nomor HP </td>
                            <td className="pr-2"> : </td>
                            <td> {pel.no_hp}</td>
                          </tr>
                          <tr>
                            <td>Alamat </td>
                            <td> : </td>
                            <td> {pel.alamat}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    </Link>
                  )
                }
              })
            }
            </div> 
            </>
            }
            <h1 className="my-6 text-center text-3xl font-bold">PELANGGAN LAIN</h1>
            <div className="flex gap-4 flex-wrap justify-center mb-20">
            {pelanggan.map((pel)=>{
        
                  return(
                    <Link to={"/detail-pelanggan/" + pel.nama.replace(/\s+/g, '-').toLowerCase()}>
                    <div className="border-2 border-gray-400 p-4">
                      <h1 className="font-bold text-xl text-center pb-4">{pel.nama}</h1>
                      <div className="px-2 pb-4">
                        <table>
                          <tr>
                            <td className="pr-2">Nomor HP </td>
                            <td className="pr-2"> : </td>
                            <td> {pel.no_hp}</td>
                          </tr>
                          <tr>
                            <td>Alamat </td>
                            <td> : </td>
                            <td> {pel.alamat}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                    </Link>
                  )
              })
            }
            </div> 
          </>
        )
      }
}