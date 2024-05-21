import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function DetailTransaksi() {
  const dtl = useParams()
  const param = Object.values(dtl)[0]

  const [isloading, setloading] = useState(true)
  const [, forceRender] = useState(undefined);
  const [pelanggan, setPelanggan] = useState([])
  const [kompresor, setKompresor] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [temp, setTemp] = useState([])
  const [dataFound, setDataFound] = useState(false)
  const [transaksiKeys, setTransaksiKeys] = useState([])

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  useEffect(()=>{
      fetchTransaksi()
    },[])



    // useEffect(()=>{
    //     fetchPelanggan()
    //     fetchKompresor()
        
    // },[transaksi])
  
  const fetchPelanggan = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Pelanggan")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
            Object.values(snapshot.val()).forEach((plg)=>{
                if(plg.nama.replace(/\s+/g, '-').toLowerCase() == param){
                    // setSelectedType("kompresor")
                    setPelanggan(plg)
                    setDataFound(true)
                }
            })
        
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
        Object.keys(snapshot.val()).forEach((e, index)=>{
            if(e == param){
                setTransaksi(Object.values(snapshot.val())[index])
                setTransaksiKeys(e)
                setDataFound(true)
            }
        })
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
  } else if(dataFound){
    console.log(temp)  
    return (
      <>
        <div>
            <h1>detail Transaksi</h1>
            <div ref={componentRef}>
                <h1>detail Transaksi</h1>
                <Link to={"/detail-pelanggan/" + transaksi.nama.replace(/\s+/g, '-').toLowerCase()}>nama : {transaksi.nama}</Link>
                <p>no_hp : {transaksi.no_hp}</p>
                <p>alamat : {transaksi.alamat}</p>
                <Link to={"/detail-kompresor/" + transaksi.jenis}>jenis : {transaksi.jenis}</Link>
                <p>lama_sewa : {transaksi.lama_sewa}</p>
                <p>tanggal_sewa : {transaksi.tanggal_sewa}</p>
                <p>kembali : {transaksi.kembali? "ya" : "tidak"}</p>
                <p>lunas : {transaksi.lunas? "ya" : "tidak"}</p>
                {transaksi.tanggal_kembali

                }
            </div>
            <button onClick={handlePrint}>Print article</button>
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

