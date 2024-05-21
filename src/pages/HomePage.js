import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import app from '../firebase.js'
import { getDatabase, ref, get } from "firebase/database"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function HomePage() {
  const [isloading, setloading] = useState(true)
  const [kompresor, setKompresor] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [transaksiKeys, setTransaksiKeys] = useState([])
  const [notaSewa, setNotaSewa] = useState(true)
  const [notaPembayaran, setNotaPembayaran] = useState(true)
  const [sewaKompresor, setSewaKompresor] = useState(false)

    // console.log(kompresor)

  useEffect(()=>{
    fetchKompresor()
    fetchTransaksi()
  },[])

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
    const db = getDatabase(app)
    const dbref = ref(db, "Transaksi")
    const snapshot = await get(dbref)
    if(snapshot.exists()){
        console.log((snapshot.val()))
        console.log(Object.values(snapshot.val()))
        setTransaksiKeys(Object.keys(snapshot.val()))
        setTransaksi(Object.values(snapshot.val()))
        setloading(false)
        Object.values(snapshot.val()).forEach((e)=>{
          if (!e['nota_sewa']){
            setNotaSewa(false)
          }
          console.log(e['jenis'] + " " + (!e['nota_pembayaran'] && e['kembali']) + " " + e['kembali'])
          if (!e['nota_pembayaran'] && e['kembali']){
            setNotaPembayaran(false)
          }
        })
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
    console.log(kompresor)
    return (
      <>{(!notaPembayaran || !notaSewa) &&
          <div> 
            <h1>Nota yang perlu di print</h1>
            <div>
            {!notaSewa &&
              <div>
                <h1>Nota sewa</h1>
                <div className="flex gap-4 flex-wrap">
                  {transaksi.map((tran, index)=>{
                      if(!tran['nota_sewa']){
                          return (
                            <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2"> 
                              <table>
                                <tr>
                                  <td>nama penyewa</td>
                                  <td> : </td>
                                  <td> <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
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
                                  <td>rencana lama sewa</td>
                                  <td>:</td>
                                  <td>{tran.lama_sewa} hari</td>
                                </tr>
                              </table>
                              <Link to={"/detail-transaksi/" + transaksiKeys[index]}>print nota</Link>
                          </div>
                          )
                        }
                    })}
                </div>  
              </div>
            }
            {!notaPembayaran &&
              <div>
                <h1>Nota Pembayaran</h1>
                <div className="flex gap-4 flex-wrap">
                  {transaksi.map((tran, index)=>{
                      if(!tran['nota_pembayaran'] && tran['kembali']){
                          return (
                          <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2"> 
                              <table>
                                <tr>
                                  <td>nama penyewa</td>
                                  <td> : </td>
                                  <td> <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
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
                                  <td>tanggal_kembali</td>
                                  <td>:</td>
                                  <td>{tran.tanggal_kembali}</td>
                                </tr>
                                <tr>
                                  <td>total_harga</td>
                                  <td>:</td>
                                  <td>{tran.total_harga}</td>
                                </tr>
                              </table>
                              <Link to={"/detail-transaksi/" + transaksiKeys[index]}>print nota</Link>
                          </div>
                          )
                        }
                    })}
                </div>  
              </div>
            }
            </div>
          </div>
        }
        <div>
          <h1>Kompresor yang bisa disewa</h1>
          {sewaKompresor &&
            <div>
              <div>
                  <h1>Kompresor sudah diservis</h1>
                  <div className="flex gap-4 flex-wrap">
                  {kompresor.map((kom)=>{
                      if(kom.servis) 
                          return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                  })}
                  </div>
              </div>
              <div>
                  <h1>Kompresor belum diservis</h1>
                  <div className="flex gap-4 flex-wrap">
                  {kompresor.map((kom)=>{
                      if(!kom.servis && kom.kembali) 
                          return <Link to={"/detail-kompresor/"+kom.jenis} key={kom.jenis}>{kom.jenis}</Link>
                  })}
                  </div>
              </div>
            </div>
          }
          {!sewaKompresor &&
            <h1>Tidak ada kompresor yang bisa disewa</h1>
          }
        </div>

        <div>
            <h1>Kompresor yang keluar</h1>
            <div className="flex gap-4">
            {transaksi.map((tran, index)=>{
                if(!tran.kembali){
                    return (
                    <div key={tran.kompresor} className="border-2 border-gray-400 m-2 p-2">
                    <table>
                                <tr>
                                  <td>nama penyewa</td>
                                  <td> : </td>
                                  <td> <Link to={"/detail-pelanggan/" + tran.nama.replace(/\s+/g, '-').toLowerCase()}> {tran.nama}</Link></td>
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
                                  <td>rencana lama sewa</td>
                                  <td>:</td>
                                  <td>{tran.lama_sewa} hari</td>
                                </tr>
                              </table>
                              <Link to={"/detail-transaksi/" + transaksiKeys[index]}>selengkapnya</Link>
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

