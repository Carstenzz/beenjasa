import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function DetailPage() {
  const dtl = useParams()
  const param = Object.values(dtl)[0]
  const type = /\d/.test(param)? "kompresor" : "pelanggan"

  const [isloading, setloading] = useState(true)
  const [, forceRender] = useState(undefined);
  const [pelanggan, setPelanggan] = useState([])
  const [kompresor, setKompresor] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [temp, setTemp] = useState([])
  const [dataFound, setDataFound] = useState(false)

  useEffect(()=>{
      forceRender(prev => !prev)
      fetchTransaksi()
    },[])



    useEffect(()=>{
        if(type == "kompresor"){
            fetchKompresor()
            fetchPelanggan()
        } else {
            fetchPelanggan()
            fetchKompresor()
        }
    },[transaksi])
  
  const fetchPelanggan = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Pelanggan")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        if(type == "pelanggan"){
            Object.values(snapshot.val()).forEach((plg)=>{
                if(plg.nama.replace(/\s+/g, '-').toLowerCase() == param){
                    // setSelectedType("kompresor")
                    setPelanggan(plg)
                    setDataFound(true)
                }
            })
        } else {
            setTemp([])
            // console.log(Object.values(snapshot.val()))
            Object.values(snapshot.val()).forEach((plg)=>{
                // console.log('a')
                // console.log(transaksi)
                transaksi.forEach(e=>{
                    // console.log('b ' + kompresor.jenis)
                    if(e.jenis == kompresor.jenis && e.nama == plg.nama){
                        // console.log('c')
                        setTemp((prev)=>[...prev, plg])
                    }
                })
            })
            setloading(false)
        }
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
        if(type == "kompresor"){
            Object.values(snapshot.val()).forEach((kom)=>{
                if(kom.jenis == param){
                    // setSelectedType("kompresor")
                    setKompresor(kom)
                    setDataFound(true)
                }
            })
        } else {
            setTemp([])
            Object.values(snapshot.val()).forEach((kom)=>{
                transaksi.forEach(e=>{
                    // console.log(e.nama + " " + pelanggan.nama)
                    // console.log(e.jenis + " " + kom.jenis)
                    if(e.nama == pelanggan.nama && e.jenis == kom.jenis){
                        console.log(kom)
                        setTemp((prev)=>[...prev, kom])
                    }
                })
                // if(kom.jenis == param){
                //     // setSelectedType("kompresor")
                //     setKompresor(kom)
                //     setDataFound(true)
                // }
            })
            setloading(false)
        }
        // setKompresor(Object.values(snapshot.val()))
        
    } else {
        console.log("error")
    }
  }

  const fetchTransaksi = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "transaksi")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        setTransaksi(Object.values(snapshot.val()))
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
  } else if(type == "pelanggan" &&dataFound){
    console.log(temp)  
    return (
      <>
        <div>
            <div>
                <h1>detail Pelanggan</h1>
                <p>nama : {pelanggan.nama}</p>
                <p>nomor hp : {pelanggan.no_hp}</p>
                <p>alamat : {pelanggan.alamat}</p>
                <p>nik : {pelanggan.nik}</p>
                <p>link_ktp : {pelanggan.link_ktp}</p>
            </div>
            <div>
                <h1>Riwayat transaksi</h1>
                <div className="flex flex-wrap gap-4">
                    {transaksi.map((tran)=>{
                        if(tran.nama == pelanggan.nama){
                            {/* setTemp([...temp, tran])
                            console.log(temp) */}
                            return (
                            <div key={tran.jenis} className="border-2 border-gray-400 m-2 p-2">
                                <h1>{tran.jenis}</h1>
                                <Link to={"/detail/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}>penyewa : {tran.nama}</Link>
                                <p>tanggal sewa : {tran.tgl_sewa}</p>
                                <p>rencana sewa : {tran.rencana}</p>
                                <p>sudah Kembali : {tran.kembali? "ya" : "tidak"}</p>
                            </div>
                            )
                        }
                    })}
                </div>
            </div>
            <div>
                <h1>Kompresor yang pernah atau sedang disewa</h1>
                {temp.map((kom)=>{
                    return(
                    <Link to={"/detail/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                    )
                })}
            </div>
        </div>
      </>
    )
  } else if(type == "kompresor" && dataFound) {
    // console.log(transaksi)
    return(
        <>
            <div>
                <div>
                    <h1>detail Kompresor</h1>
                    <p>jenis : {kompresor.jenis}</p>
                    <p>harga per hari : {kompresor.biaya}</p>
                    <p>status : {kompresor.kembali? kompresor.tersedia? "siap disewa" : "belum diservice" : "sedang disewa"}</p>

                </div>
                <div>
                    <h1>Riwayat transaksi</h1>
                    <div className="flex flex-wrap gap-4">
                        {transaksi.map((tran)=>{
                            if(tran.jenis == kompresor.jenis){
                                return (
                                <div key={tran.jenis} className="border-2 border-gray-400 m-2 p-2">
                                    <h1>tanggal sewa : {tran.tgl_sewa}</h1>
                                    <Link to={"/detail/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}>penyewa : {tran.nama}</Link>
                                    <p>rencana sewa : {tran.rencana}</p>
                                    <p>sudah Kembali : {tran.kembali? "ya" : "tidak"}</p>
                                    {tran.kembali &&
                                        <>
                                            <p>tanggal kembali : </p>
                                            <p>total harga : </p>
                                        </>
                                    }
                                </div>
                                )
                            }
                        })}
                    </div>
                </div>
                <div>
                    <h1>Orang yang pernah menyewa kmpresor ini</h1>
                    {temp.map((plg)=>{
                        return (
                            <Link to={"/detail/" + plg.nama.replace(/\s+/g, '-').toLowerCase()} className="border-2 border-gray-400">
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
  } else {
    return(
        <>
            Data tidak ditemukan
        </>
    )
  }
}

