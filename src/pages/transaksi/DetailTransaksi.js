import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../../firebase.js'
import { getDatabase, ref, get, update } from "firebase/database"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import kompresorPic from '../../assets/kompresorPic.png'
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function DetailTransaksi() {
  const params = useParams()
  const param = Object.values(params)[0]

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

  useEffect(()=>{
      fetchKompresor()
      fetchPelanggan()
    },[transaksi])

  useEffect(()=>{
      print()
    },[isloading])

  



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
                if(plg.nik === transaksi.nik){
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

  const fetchTransaksi = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Transaksi")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        setTransaksi(Object.values(snapshot.val()))
        setTransaksiKeys(Object.keys(snapshot.val()))
        Object.keys(snapshot.val()).forEach((e, index)=>{
            if(e === param){
                setTransaksi(Object.values(snapshot.val())[index])
                setTransaksiKeys(e)
                setDataFound(true)
            }
        })
    } else {
        console.log("error")
    }
  }

  const fetchKompresor = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Kompresor")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
            Object.values(snapshot.val()).forEach((kom)=>{
                if(kom.jenis === transaksi.jenis){
                    setKompresor(kom)
                    setloading(false)
                }
            })
        // setKompresor(Object.values(snapshot.val()))
    } else {
        console.log("error")
    }
  }

  const date = new Date().toISOString().split('T')[0]


  const sewa = async () => {
    const db = getDatabase(app)
    update(ref(db, "Transaksi/" + transaksiKeys),{
        nota_sewa : true,
    })
    console.log(transaksiKeys)
    fetchPelanggan()
    forceRender((prev)=>!prev)
}  

const pembayaran = async () => {
  const db = getDatabase(app)
  update(ref(db, "Transaksi/" + transaksiKeys),{
      nota_pembayaran : true,
  })
  console.log(transaksiKeys)
  fetchPelanggan()
  forceRender((prev)=>!prev)
}  

const print = () => {
  if(Object.values(params)[1] === "print"){
    console.log("print")
    console.log("pl")
    handlePrint()
  }
}
  
  if(isloading){
    return (
      <div className="w-full h-screen grid place-items-center">
        <h1 className="font-bold text-3xl">Loading</h1>
      </div>
    )
  } else if(dataFound){
    console.log(kompresor)
    return (
      <>
        <div className="flex justify-center gap-40 mb-20 pr-32">
          <div className="flex flex-col gap-10 items-center">
          <h1 className="mt-16 text-2xl font-bold text-center">Detail Pelanggan</h1>
            <div className="font-semibold flex justify-center gap-10">
                <table>
                    <tr>  
                        <td>Nama </td>
                        <td> : </td>
                        <td> {pelanggan.nama}</td>
                    </tr>
                    <tr>
                        <td className="pr-2">Nomor HP </td>
                        <td className="pr-2"> : </td>
                        <td> {pelanggan.no_hp}</td>
                    </tr>
                    <tr>
                        <td>Alamat </td>
                        <td> : </td>
                        <td> {pelanggan.alamat}</td>
                    </tr>
                    <tr>
                        <td>NIK </td>
                        <td> : </td>
                        <td> {pelanggan.nik}</td>
                    </tr>
                </table>
                <div className="flex flex-col items-center justify-between">
                    <p>foto ktp</p>
                    <img src={pelanggan.ktp} className="h-40 border-2"/>
                </div>
              </div>
              <Link to={"/pelanggan/" + transaksi.nama.replace(/\s+/g, '-').toLowerCase()} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">selengkapnya</Link>
          </div>
          <div className="flex flex-col gap-10 items-center justify-between">
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
              </div>
              <Link to={"/kompresor/"+kompresor.jenis} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">selengkapnya</Link>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-10">
            <h1 className="text-3xl font-bold mb-4">Nota Transaksi</h1>
            <div ref={componentRef} className=" border-2 border-gray-400 bg-sky-50" style={{ height: 700, width:500}}>
            <div className="flex justify-between items-center px-4 pt-2">
              <h1 className="text-xl font-bold">Beenjasa</h1>
              <h1>{date}</h1>
            </div>
            <h1 className="text-center font-bold">Nota Sewa Kompresor</h1>
            <div className="border-2 border-gray-600 mx-10 h-4/5 p-10 relative bg-white">
                <table>
                  <tr>
                    <td>nama penyewa</td>
                    <td> : </td>
                    <td> <Link to={"/pelanggan/" + transaksi.nama.replace(/\s+/g, '-').toLowerCase()}> {transaksi.nama}</Link></td>
                  </tr>
                  <tr>
                    <td>no_hp</td>
                    <td>:</td>
                    <td>{transaksi.no_hp}</td>
                  </tr>
                  <tr>
                    <td>alamat</td>
                    <td>:</td>
                    <td>{transaksi.alamat}</td>
                  </tr>
                  <tr className="text-white">a</tr>
                  <tr>
                    <td>kompresor</td>
                    <td>:</td>
                    <td>{transaksi.jenis}</td>
                  </tr>
                  <tr>
                    <td>harga per hari </td>
                    <td>:</td>
                    <td>Rp {kompresor.biaya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00</td>
                  </tr>
                  <tr className="text-white">a</tr>
                  <tr>
                    <td>tanggal_sewa</td>
                    <td>:</td>
                    <td>{transaksi.tanggal_sewa}</td>
                  </tr>
                  {!transaksi.kembali &&
                    <tr>
                      <td>rencana lama sewa</td>
                      <td>:</td>
                      <td>{transaksi.lama_sewa} hari</td>
                    </tr>
                  }
                  {transaksi.kembali &&
                    <>
                      <tr>
                        <td>tanggal_kembali</td>
                        <td>:</td>
                        <td>{transaksi.tanggal_kembali}</td>
                      </tr>
                      <tr>
                        <td>total_harga</td>
                        <td>:</td>
                        <td>Rp {transaksi.total_harga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00</td>
                      </tr>
                      <tr>
                        <td>Status lunas</td>
                        <td>:</td>
                        <td>{transaksi.lunas? "ya" : "tidak"}</td>
                      </tr>
                    </>
                  }
                </table>
                <img src={kompresorPic} className="opacity-15 absolute bottom-10 left-1/2 -translate-x-1/2 "/>
            </div>
            {/* { !transaksi.nota_sewa &&
            }
            { (!transaksi.nota_pembayaran && transaksi.kembali) &&
              <button onClick={handlePrint}>Print nota pembayaran</button>
            } */}
            </div>
              <button onClick={()=>{
                if(!transaksi.kembali){
                  sewa()  
                } 
                if(transaksi.kembali)(
                  pembayaran()
                )
                handlePrint()
              }} className="mb-32 mt-8 bg-green-500 rounded-xl px-4 py-2">Print nota</button>
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

