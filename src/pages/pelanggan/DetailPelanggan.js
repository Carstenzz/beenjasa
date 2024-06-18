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
      fetchPelanggan()
    },[])
    
    useEffect(()=>{
      fetchKompresor()
    },[transaksi, pelanggan])


    useEffect(()=>{
        if(temp.length > 1){
            let filtered = []
            temp.forEach((e)=>{
                let same = false
                filtered.forEach((filter)=>{
                    if(e.jenis == filter.jenis) same = true
                })
                if(!same) filtered.push(e)
            })
            setKompresor(filtered)
        }
    },[temp])

  
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
                    if(e.nik == pelanggan.nik && e.jenis == kom.jenis){
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
        <div className="mx-20">
        <div className="bg-sky-50 p-4 rounded-xl mt-12">
            <h1 className="text-2xl font-bold mt-4 text-center pb-4">Detail Pelanggan</h1>
            <div className="mt-4 font-semibold flex justify-center gap-20 mb-6">
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
            <div className="flex flex-col items-center justify-between text-xl font-semibold mt-10">
                <p className="mb-2">
                Status blacklist : {pelanggan.blacklist? <span className="text-orange-600">Pelanggan Diblacklist</span> : <span className="text-green-600">Pelanggan Tidak Diblacklist</span>}
                </p>
                <button className="bg-yellow-500 text-white p-2 px-4 rounded-xl" onClick={()=>{blacklist()}}>Ubah status blacklist</button>
            </div>
        </div>
            <div className="mt-16">
                    <h1 className="text-2xl font-bold mt-16 text-center pb-4">Riwayat transaksi</h1>
                    <div className="flex gap-4 flex-wrap justify-center">
                        {transaksi.map((tran, index)=>{
                            if(tran.nik == pelanggan.nik){
                                return(
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
            <h1 className="text-2xl font-bold mt-16 text-center pb-4">Kompresor yang pernah atau sedang disewa</h1>
            <div className="flex flex-wrap gap-4 justify-center mb-20">
                {kompresor.map((kom)=>{
                    if(kom.servis && kom.kembali) 
                        return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                })}
                {kompresor.map((kom)=>{
                    if(!kom.servis && kom.kembali) 
                        return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-amber-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                })}
                {kompresor.map((kom)=>{
                    if(!kom.kembali) 
                        return <Link to={"/kompresor/"+kom.jenis} key={kom.jenis} className="bg-red-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                })}
            </div>
            <br></br>
            <br></br>
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

