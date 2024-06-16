import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../../firebase.js'
import { getDatabase, ref, get, update } from "firebase/database"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function DetailKompresor() {
  const dtl = useParams()
  const param = Object.values(dtl)[0]

  const [isloading, setloading] = useState(true)
  const [, forceRender] = useState(undefined);
  const [pelanggan, setPelanggan] = useState([])
  const [kompresor, setKompresor] = useState([])
  const [kompresorKey, setKompresorKey] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [temp, setTemp] = useState([])
  const [dataFound, setDataFound] = useState(false)
  const [transaksiKeys, setTransaksiKeys] = useState([])

  useEffect(()=>{
      fetchKompresor()
      fetchTransaksi()
    },[])



    useEffect(()=>{
        fetchPelanggan()
    },[transaksi, kompresor])
  
  const fetchPelanggan = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Pelanggan")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        setTemp([])
        console.log(Object.values(snapshot.val()))
        console.log(transaksi)
        Object.values(snapshot.val()).forEach((plg)=>{
            // console.log('a')
            transaksi.forEach(e=>{
                // console.log('b ' + kompresor.jenis)
                if(e.jenis == kompresor.jenis && e.nik == plg.nik){
                    setTemp((prev)=>[...prev, plg])
                }
            })
        })
        setloading(false)
    } else {
        console.log("error")
    }
    // .then((data)=>{return Object.values(data.val())})
    // .then((data)=>{
    //     data.forEach((plg)=>{
    //         console.log(plg.nama.replace(/\s+/g, '-').toLowerCase())
    //         console.log(param)
    //         if(plg.nama.replace(/\s+/g, '-').toLowerCase() === param){
    //             // setSelectedType("pelanggan");
    //             setPelanggan(plg);
    //             console.log(plg)
    //         }
    //         // setPelanggan(plg)
    //     })
    //     // setloading(false)
    // })
    // if(snapshot.exists()){
    //     const temp = Object.values(snapshot.val())
    //     console.log(temp)
    //     temp.forEach((plg)=>{
    //         console.log(plg.nama.replace(/\s+/g, '-').toLowerCase())
    //         console.log(param)
    //         // if(plg.nama.replace(/\s+/g, '-').toLowerCase() === param){
    //         //     // setSelectedType("pelanggan");
    //         //     // setPelanggan(plg);
    //         //     console.log(plg)
    //         // }
    //         setPelanggan(plg)
    //     })
    //     console.log(pelanggan)
    // } else {
    //     console.log("error")
    // }
  }

  const fetchKompresor = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Kompresor")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        const key = Object.keys(snapshot.val())
            Object.values(snapshot.val()).forEach((kom, index)=>{
                if(kom.jenis == param){
                    // setSelectedType("kompresor")
                    setKompresorKey(key[index])
                    setKompresor(kom)
                    setDataFound(true)
                }
            })
        // setKompresor(Object.values(snapshot.val()))
        
    } else {
        console.log("error")
    }
  }

  const fetchTransaksi = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Transaksi")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        setTransaksi(Object.values(snapshot.val()))
        setTransaksiKeys(Object.keys(snapshot.val()))
    } else {
        console.log("error")
    }
  }

  
    const servis = async () => {
        console.log(kompresorKey)
        const db = getDatabase(app)
        update(ref(db, "Kompresor/" + kompresorKey),{
            servis : !kompresor.servis,
        })
        fetchKompresor()
        forceRender((prev)=>!prev)
    }  

  if(isloading){
    return (
      <div className="w-full h-screen grid place-items-center">
        <h1 className="font-bold text-3xl">Loading</h1>
      </div>
    )
  }else if(dataFound){
    // console.log(transaksi)
    return(
        <>
            <div className="mx-20">
                <h1 className="text-2xl font-bold mt-16 text-center pb-4">Detail Kompresor</h1>
                <div className="mt-4 font-semibold flex justify-center gap-20">
                    <table>
                        <tr>
                            <td>Jenis </td>
                            <td> : </td>
                            <td> {kompresor.jenis}</td>
                        </tr>
                        <tr>
                            <td className="pr-2">Harga per hari </td>
                            <td className="pr-2"> : </td>
                            <td> {kompresor.biaya}</td>
                        </tr>
                        <tr>
                            <td>Status disewa </td>
                            <td> : </td>
                            <td> {kompresor.kembali? "tidak disewa" : "sedang disewa"}</td>
                        </tr>
                    </table>
                    <div className="flex flex-col items-center justify-between">
                        <p>
                        Status servis : {kompresor.servis? <span className="text-green-600">sudah diservis</span> : <span className="text-orange-600">butuh diservis</span>}
                        </p>
                        <button className="bg-yellow-500 text-white p-2 px-4 rounded-xl" onClick={()=>{servis()}}>Ubah status servis</button>
                    </div>
                </div>
                <div className="mt-16">
                    <h1 className="text-2xl font-bold mt-16 text-center pb-4">Riwayat transaksi</h1>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {transaksi.map((tran, index)=>{
                            if(tran.jenis == kompresor.jenis){
                                return(
                                <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2 pb-6 min-w-96 flex flex-col justify-center items-center ">
                                <div className="flex justify-between font-bold text-xl w-full mb-4">
                                    <p><Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></p>
                                    <p><Link to={"/detail-kompresor/" + tran.jenis}> {tran.jenis}</Link></p>
                                </div>
                                <table className="mb-6">
                                    <tr>
                                    <td>nama penyewa</td>
                                    <td className="pr-2"> : </td>
                                    <td > <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
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
                                    <Link to={"/detail-transaksi/" + transaksiKeys[index]} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">selengkapnya</Link>
                                </div>
                                </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <h1 className="text-2xl font-bold mt-16 text-center pb-4">Orang yang pernah menyewa kompresor ini</h1>
                <div className="flex gap-4 flex-wrap justify-center mb-20">
                    {temp.map((plg)=>{
                        return(
                            <Link to={"/detail-pelanggan/" + plg.nama.replace(/\s+/g, '-').toLowerCase()}>
                            <div className="border-2 border-gray-400 p-4">
                            <h1 className="font-bold text-xl text-center pb-4">{plg.nama}</h1>
                            <div className="px-2 pb-4">
                                <table>
                                <tr>
                                    <td className="pr-2">Nomor HP </td>
                                    <td className="pr-2"> : </td>
                                    <td> {plg.no_hp}</td>
                                </tr>
                                <tr>
                                    <td>Alamat </td>
                                    <td> : </td>
                                    <td> {plg.alamat}</td>
                                </tr>
                                </table>
                            </div>
                            </div>
                            </Link>
                        )
                })}
                </div>
            </div>
        </>
    )
  } else {
    return(
        <>
            Data tidak ditemukan
        </>
    )
  }
}

