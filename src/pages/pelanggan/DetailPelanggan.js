import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../../firebase.js'
import { getDatabase, ref, get, update } from "firebase/database"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function DetailPelanggan() {
  const dtl = useParams()
  const param = Object.values(dtl)[0]

  const [isloading, setloading] = useState(true)
  const [, forceRender] = useState(undefined);
  const [pelanggan, setPelanggan] = useState([])
  const [pelangganKeys, setPelangganKeys] = useState([])
  const [kompresor, setKompresor] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [temp, setTemp] = useState([])
  const [dataFound, setDataFound] = useState(false)
  const [transaksiKeys, setTransaksiKeys] = useState([])

  useEffect(()=>{
      fetchTransaksi()
    },[])



    useEffect(()=>{
        fetchPelanggan()
        fetchKompresor()
    },[transaksi])
  
  const fetchPelanggan = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Pelanggan")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        const data = snapshot.val()
        let idx
            Object.values(data).forEach((plg, index)=>{
                if(plg.nama.replace(/\s+/g, '-').toLowerCase() == param){
                    // setSelectedType("kompresor")
                    idx = index
                    setPelanggan(plg)
                    setDataFound(true)
                }
            })
            // data.forEach((plg)=>{
            //     console.log(plg)
            // })
            // console.log(data)
            Object.keys(data).forEach((plg, index)=>{
                if(index == idx){
                    setPelangganKeys(plg)
                    // console.log(plg)
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
                        // console.log(kom)
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

  const blacklist = async () => {
        const db = getDatabase(app)
        update(ref(db, "Pelanggan/" + pelangganKeys),{
            blacklist : !pelanggan.blacklist,
        })
        // set(ref(db, 'users/' + userId), {
        //     username: name,
        //     email: email,
        //     profile_picture : imageUrl
        //   })
        //   .then(() => {
        //     // Data saved successfully!
        //   })
        //   .catch((error) => {
        //     // The write failed...
        //   });
        console.log(pelangganKeys)
        fetchPelanggan()
        forceRender((prev)=>!prev)
        // let updates = {}
        // updates["/"+ pelangganKeys + "/blacklist"] = !pelanggan.blacklist
        // const dbref = ref(db, "Pelanggan")
        // dbref.update(updates)
        // const snapshot = await get(dbref)
        // if(snapshot.exists()){
        //     Object.values(snapshot.val()).forEach((plg)=>{
        //         if(plg.nama.replace(/\s+/g, '-').toLowerCase() == param){
        //             // setSelectedType("kompresor")
        //             setPelanggan(plg)
        //             setDataFound(true)
        //         }
        //     })
            
        // } else {
        //     console.log("error")
        // }
    }  



  if(isloading){
    return (
      <div className="w-full h-screen grid place-items-center">
        <h1 className="font-bold text-3xl">Loading</h1>
      </div>
    )
  } else if(dataFound){
    // console.log(temp)  
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
                    {transaksi.map((tran,index)=>{
                        if(tran.nama == pelanggan.nama){
                            return (
                            <div key={tran.jenis} className="border-2 border-gray-400 m-2 p-2">
                                <Link to={"/detail-kompresor/" + tran.jenis}>{tran.jenis}</Link>
                                <p>penyewa : {tran.nama}</p>
                                <p>tanggal sewa : {tran.tgl_sewa}</p>
                                <p>rencana sewa : {tran.rencana}</p>
                                <p>sudah Kembali : {tran.kembali? "ya" : "tidak"}</p>
                                <Link to={"/detail-transaksi/" + transaksiKeys[index]}>selengkapnya</Link>
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
                    <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                    )
                })}
            </div>
            <button onClick={()=>{blacklist()}}>{pelanggan.blacklist? "unblacklist" : "blacklist"}</button>
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

