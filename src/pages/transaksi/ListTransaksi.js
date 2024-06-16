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
    const [nama, setnama] = useState("")
    const [jenis, setjenis] = useState("")
    

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
          <div className="px-20 pb-16">
          <h1 className="text-2xl font-bold mt-16 text-center pb-4">Filter Berdasarkan</h1>
            <div className="flex justify-center gap-32">
              <div className="flex gap-2 flex-col">
                  <p>Nama pelanggan </p>
                  <input inputMode="text" className="w-60 border-2 p-1 border-gray-400" placeholder="nama" onChange={(e)=>{setnama(e.target.value)}}/>
                  {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
              </div>
              <div className="flex gap-2 flex-col">
                  <p>Jenis kompresor </p>
                  <input inputMode="text" className="w-60 border-2 p-1 border-gray-400" placeholder="kompresor" onChange={(e)=>{setjenis(e.target.value)}}/>
              </div>
            </div>

              
            <h1 className="text-2xl font-bold mt-16 text-center pb-4">Transaksi yang sedang berlangsung</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {transaksi.map((tran, index)=>{
                if(!tran.kembali && (nama === "" || nama.toLowerCase() === tran.nama.toLowerCase()) && (jenis === "" || jenis.toLowerCase() === tran.jenis.toLowerCase())){
                    return (
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

            <h1 className="text-2xl font-bold mt-16 text-center pb-4">Transaksi yang belum dibayar</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {transaksi.map((tran, index)=>{
                if(!tran.lunas && (nama === "" || nama.toLowerCase() === tran.nama.toLowerCase()) && (jenis === "" || jenis.toLowerCase() === tran.jenis.toLowerCase())){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2 pb-6 min-w-96 flex flex-col justify-center items-center ">
                      <div className="flex justify-between font-bold text-xl w-full mb-4">
                        <p><Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></p>
                        <p><Link to={"/detail-kompresor/" + tran.jenis}> {tran.jenis}</Link></p>
                      </div>
                      <table className="mb-6">
                        <tr>
                          <td>Nama penyewa</td>
                          <td className="pr-2"> : </td>
                          <td > <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
                        </tr>
                        <tr>
                          <td>Nomor HP</td>
                          <td>:</td>
                          <td>{tran.no_hp}</td>
                        </tr>
                        <tr>
                          <td>Alamat</td>
                          <td>:</td>
                          <td>{tran.alamat}</td>
                        </tr>
                        <tr>
                          <td>Kompresor</td>
                          <td>:</td>
                          <td>{tran.jenis}</td>
                        </tr>
                        <tr>
                          <td>Tanggal sewa</td>
                          <td>:</td>
                          <td>{tran.tanggal_sewa}</td>
                        </tr>
                        <tr>
                          <td className="pr-2">Tanggal kembali</td>
                          <td>:</td>
                          <td>{tran.tanggal_kembali}</td>
                        </tr>
                        <tr>
                          <td className="pr-2">Total harga</td>
                          <td>:</td>
                          <td>{tran.total_harga}</td>
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

            <h1 className="text-2xl font-bold mt-16 text-center pb-4">Transaksi lainnya</h1>
            <div className="flex gap-4 flex-wrap justify-center">
            {transaksi.map((tran, index)=>{
                if((nama === "" || nama.toLowerCase() === tran.nama.toLowerCase()) && (jenis === "" || jenis.toLowerCase() === tran.jenis.toLowerCase()))
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2 pb-6 min-w-96 flex flex-col justify-center items-center ">
                      <div className="flex justify-between font-bold text-xl w-full mb-4">
                        <p><Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></p>
                        <p><Link to={"/detail-kompresor/" + tran.jenis}> {tran.jenis}</Link></p>
                      </div>
                      <table className="mb-6">
                        <tr>
                          <td>Nama penyewa</td>
                          <td className="pr-2"> : </td>
                          <td > <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
                        </tr>
                        <tr>
                          <td>Nomor HP</td>
                          <td>:</td>
                          <td>{tran.no_hp}</td>
                        </tr>
                        <tr>
                          <td>Alamat</td>
                          <td>:</td>
                          <td>{tran.alamat}</td>
                        </tr>
                        <tr>
                          <td>Kompresor</td>
                          <td>:</td>
                          <td>{tran.jenis}</td>
                        </tr>
                        <tr>
                          <td>Tanggal sewa</td>
                          <td>:</td>
                          <td>{tran.tanggal_sewa}</td>
                        </tr>
                        <tr>
                          <td className="pr-2">Tanggal kembali</td>
                          <td>:</td>
                          <td>{tran.tanggal_kembali}</td>
                        </tr>
                        <tr>
                          <td className="pr-2">Total harga</td>
                          <td>:</td>
                          <td>{tran.total_harga}</td>
                        </tr>
                      </table>
                      <div className="w-fit m-auto">
                        <Link to={"/detail-transaksi/" + transaksiKeys[index]} className="bg-green-600 px-5 py-2 rounded-lg text-white font-semibold">selengkapnya</Link>
                      </div>
                    </div>
                    )
            })}
            </div>   

            
        </div>
          </>
        )
      }
}