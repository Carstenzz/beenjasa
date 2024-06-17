import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../firebase.js'
import { getDatabase, ref, get, update } from "firebase/database"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function HomePage() {
  const [isloading, setloading] = useState(true)
  const [isfetching, setfetching] = useState(false)
  const [kompresor, setKompresor] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [transaksiKeys, setTransaksiKeys] = useState([])
  const [notaSewa, setNotaSewa] = useState(true)
  const [notaPembayaran, setNotaPembayaran] = useState(true)
  const [sewaKompresor, setSewaKompresor] = useState(false)

    // console.log(kompresor)

  useEffect(()=>{
    setInterval(() => {
      if(!isfetching){
        fetchKompresor()
        fetchTransaksi()
      }
    }, 1500);
  },[])

  const openInNewTab = (url) => {
    console.log("test")
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  function compareByName(a, b) {
    return a.jenis.localeCompare(b.jenis);
  }

  const fetchKompresor = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Kompresor")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        // console.log(Object.values(snapshot.val()))
        setKompresor(Object.values(snapshot.val()).sort(compareByName))
        Object.values(snapshot.val()).forEach((e)=>{
          if (e['kembali']){
            setSewaKompresor(true)
          }
        })
    } else {
        console.log("error")
    }
  }

  const fetchTransaksi = async () => {
    setfetching(true)
    const db = getDatabase(app)
    const dbref = ref(db, "Transaksi")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        setTransaksiKeys(Object.keys(snapshot.val()))
        setTransaksi(Object.values(snapshot.val()))
        Object.values(snapshot.val()).forEach((e, index)=>{
          if (!e['nota_sewa'] && !e['kembali']){
            setNotaSewa(false)
            openInNewTab("/transaksi/" + Object.keys(snapshot.val())[index] + "/print")
            sewa(Object.keys(snapshot.val())[index])
          }
          if (!e['nota_pembayaran'] && e['kembali']){
            setNotaPembayaran(false)
            openInNewTab("/transaksi/" + Object.keys(snapshot.val())[index] + "/print")
            pembayaran(Object.keys(snapshot.val())[index])
          }
        })
        setloading(false)
        setfetching(false)
      } else {
        console.log("error")
    }
  }

  
  const sewa = async (key) => {
    const db = getDatabase(app)
    update(ref(db, "Transaksi/" + key),{
        nota_sewa : true,
    })
    // console.log(transaksiKeys)
    // fetchPelanggan()
    // forceRender((prev)=>!prev)
  }  

  const pembayaran = async (key) => {
    const db = getDatabase(app)
    update(ref(db, "Transaksi/" + key),{
        nota_pembayaran : true,
    })
    // console.log(transaksiKeys)
    // fetchPelanggan()
    // forceRender((prev)=>!prev)
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
        <div className="bg-sky-100 mx-20 p-4 rounded-xl">
          <h1 className="text-2xl font-bold text-center mb-4">STATUS KOMPRESOR</h1>
          <div className="flex justify-around">
            <div className=" border-2 border-green-600 bg-white rounded-xl p-4 w-1/4 min-h-52">
              <h1 className="text-xl font-bold text-center text-green-600 mb-4">Kompresor siap disewa</h1>
              <div className="flex flex-wrap gap-4">
                  {kompresor.map((kom)=>{
                      if(kom.servis && kom.kembali) 
                          return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                  })}
              </div>
            </div>
            <div className=" border-2 border-amber-600 bg-white rounded-xl p-4 w-1/4 min-h-52">
              <h1 className="text-xl font-bold text-center text-amber-500 mb-4">Kompresor belum disevis</h1>
              <div className="flex flex-wrap gap-4">
                  {kompresor.map((kom)=>{
                      if(!kom.servis && kom.kembali) 
                          return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-amber-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                  })}
              </div>
            </div>
            <div className=" border-2 border-red-500 bg-white rounded-xl p-4 w-1/4 min-h-52">
              <h1 className="text-xl font-bold text-center text-red-500 mb-4">Kompresor sedang disewa</h1>
              <div className="flex flex-wrap gap-4">
                  {kompresor.map((kom)=>{
                      if(!kom.kembali) 
                          return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-red-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-20 pb-16">
            <h1 className="text-2xl font-bold mt-16 text-center">Transaksi yang sedang berlangsung</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {transaksi.map((tran, index)=>{
                if(!tran.kembali){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2 pb-6 min-w-96 flex flex-col justify-center items-center ">
                      <div className="flex justify-between font-bold text-xl w-full mb-4">
                        <p><Link to={"/pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></p>
                        <p><Link to={"/kompresor/" + tran.jenis}> {tran.jenis}</Link></p>
                      </div>
                      <table className="mb-6">
                        <tr>
                          <td>nama penyewa</td>
                          <td className="pr-2"> : </td>
                          <td > <Link to={"/pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
                        </tr>
                        <tr>
                          <td>no_hp</td>
                          <td>:</td>
                          <td>{tran.no_hp}</td>
                        </tr>
                        <tr>
                          <td>alamat</td>
                          <td>:</td>
                          <td>{tran.alamat}</td>
                        </tr>
                        <tr>
                          <td>kompresor</td>
                          <td>:</td>
                          <td>{tran.jenis}</td>
                        </tr>
                        <tr>
                          <td>tanggal_sewa</td>
                          <td>:</td>
                          <td>{tran.tanggal_sewa}</td>
                        </tr>
                        <tr>
                          <td className="pr-2">rencana lama sewa</td>
                          <td>:</td>
                          <td>{tran.lama_sewa} hari</td>
                        </tr>
                      </table>
                      <div className="w-fit m-auto">
                        <Link to={"/transaksi/" + transaksiKeys[index]} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">selengkapnya</Link>
                      </div>
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

