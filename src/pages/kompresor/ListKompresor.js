import { useEffect, useState } from "react"
import app from '../../firebase.js'
import { getDatabase, ref, get, push, set } from "firebase/database"
import { Link } from "react-router-dom"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function ListKompresor() {
    const [isloading, setloading] = useState(true)
    const [kompresor, setKompresor] = useState([])
    const [kategori, setKategori] = useState([])
    const [jumlah, setJumlah] = useState([])
    const [harga, setHarga] = useState([])
    const [jenis, setJenis] = useState()
    const [biaya, setBiaya] = useState()

    useEffect(()=>{
        fetchkompresor()
      },[])
    
    const fetchkompresor = async () => {
    const db = getDatabase(app)
    const dbref = ref(db, "Kompresor")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        console.log(Object.values(snapshot.val()))
        setKompresor(Object.values(snapshot.val()))
        console.log(Object.values(snapshot.val()))
        let kategori = []
        Object.values(snapshot.val()).forEach((e)=>{
          let same = false
          for(let i = 0; i < kategori.length; i++){
            if(kategori[i].kategori == e.jenis[0]) same= true
          }
          if(!same){
            // jumlah[kategori.length] = 0
            // harga[kategori.length] = e.biaya
            // kategori[kategori.length][0] = e.jenis[0]
            // kategori[kategori.length][1] = e
            kategori[kategori.length] = 
            {
              kategori : e.jenis[0],
              jumlah : 0,
              harga : e.biaya,
              top : 0,
            }
          }
        })
        // console.log(jumlah)
        Object.values(snapshot.val()).forEach((e)=>{
          for(let i = 0; i < kategori.length; i++){
            console.log(kategori[i].jumlah)
            if(kategori[i].kategori == e.jenis[0]){
              if(kategori[i].top < e.jenis[1]) kategori[i].top = e.jenis[1]
              kategori[i].jumlah++
            }
          }
        })
        
        console.log(kategori)
        // console.log(jumlah)
        // setJumlah(jumlah)
        kategori.sort((k1, k2) => (k1.kategori > k2.kategori) ? 1 : (k1.kategori < k2.kategori) ? -1 : 0)
        setKategori(kategori)
        setloading(false)
    } else {
        console.log("error")
    }
    }

    const postKompresor = async (b, j, i) => {
      const db = getDatabase(app) 
      const newDocRef = push(ref(db, "Kompresor"))
      set(newDocRef, {
          biaya : parseInt(b),
          jenis : (j + i),
          kembali : true,
          servis : true,
      }).then(()=>{
          console.log("uploaded")
          fetchkompresor()
      })
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
            <h1 className="my-10 text-center text-3xl font-bold">LIST KOMPRESOR</h1>
            {kategori.map((e, index)=>{
              return (
                <div className="bg-sky-50 mx-20 p-6 rounded-xl my-12">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold text-center">KOMPRESOR KATEGORI {e.kategori}</h1>
                  <div className="flex flex-col items-end">
                    <p>Jumlah kompresor - {e.jumlah}</p>
                    <p>Harga per hari - {e.harga}</p>
                  </div>
                </div>
                <div className="flex justify-around">
                  <div className=" border-2 border-green-800 bg-white rounded-xl p-4 w-1/4 min-h-32">
                    <h1 className="text-xl font-bold text-center text-green-800 border-green-800 mb-4">Kompresor siap disewa</h1>
                    <div className="flex flex-wrap gap-4">
                        {kompresor.map((kom)=>{
                            if(kom.servis && kom.kembali && kom.jenis[0]===e.kategori) 
                                return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                        })}
                    </div>
                  </div>
                  <div className=" border-2 border-amber-800 bg-white rounded-xl p-4 w-1/4 min-h-32">
                    <h1 className="text-xl font-bold text-center text-amber-800 mb-4">Kompresor belum disevis</h1>
                    <div className="flex flex-wrap gap-4">
                        {kompresor.map((kom)=>{
                            if(!kom.servis && kom.kembali && kom.jenis[0]===e.kategori) 
                                return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis} className="bg-amber-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                        })}
                    </div>
                  </div>
                  <div className=" border-2 border-red-800 bg-white rounded-xl p-4 w-1/4 min-h-32">
                    <h1 className="text-xl font-bold text-center text-red-800 mb-4">Kompresor sedang disewa</h1>
                    <div className="flex flex-wrap gap-4">
                        {kompresor.map((kom)=>{
                            if(!kom.kembali && kom.jenis[0]===e.kategori) 
                                return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis} className="bg-red-500 px-5 py-2 rounded-lg text-white font-semibold">{kom.jenis}</Link>
                        })} 
                    </div>
                  </div>
              </div>
                <div className="w-fit m-auto mt-6">
                    <button className="bg-sky-600 px-5 py-2 rounded-lg text-white font-semibold" onClick={()=>{postKompresor(e.harga, e.kategori, parseInt(e.top)+1)}}>Tambah kompresor pada kategori ini</button>
                  </div>
              </div>
              )
            })}
            <div className="px-20 mb-20">
            <h1 className="font-bold text-xl mb-4">Tambah Kategori kompresor</h1>
            <div className="flex gap-20 items-end">
              <div className="flex gap-2 flex-col">
                  <p>Kategori kompresor </p>
                  <input inputMode="text" className="w-60 border-2 p-1 border-gray-400" placeholder="kategori" onChange={(e)=>{setJenis(e.target.value)}}/>
              </div>
              <div className="flex gap-2 flex-col">
                  <p>Harga per hari </p>
                  <input inputMode="text" className="w-60 border-2 p-1 border-gray-400" placeholder="harga" onChange={(e)=>{setBiaya(e.target.value)}}/>
              </div>
              <button className="bg-green-600 px-6 py-2 rounded-xl text-xl text-white font-semibold" onClick={()=>{postKompresor(biaya, jenis, 1)}} to={"/Kompresor"}>Tambah Kategori</button>
            </div>
          </div>
          </>
        )
      }
}