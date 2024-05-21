import { useEffect, useState } from "react"
// import {db} from "./firebase-config"
// import {collection, getDocs} from "firebase/firestore"

export default function App() {
  const [isloading, setloading] = useState(true)
  const [pelanggan, setPelanggan] = useState([])

  useEffect(()=>{
    fetchPelanggan()
  },[])

  const hitung = ()=>{
    let sewa = "2024-05-20 14:31"
    let kembali = "2024-05-23 17:50"

    
  }

  const fetchPelanggan = async () => {
    fetch('https://firestore.googleapis.com/v1/projects/beenjasa-d237c/databases/(default)/documents/transaksi')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data)
        const value = data.documents.map((doc)=>{
          for (var key in doc.fields) {
            if (doc.fields.hasOwnProperty(key)) {
              doc.fields[key] = Object.values(doc.fields[key])[0];
            }
          }
          return doc.fields
        })
        console.log(value)
        setPelanggan(value)
        setloading(false)
    });
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
        <h1 className="text-3xl font-bold underline">
          yes
        </h1>
      </>
    )
  }
}

