import { Link, Outlet } from "react-router-dom";

export default function Navbar (){
    return(
        <>
            <div className="flex justify-between items-center p-5 px-10 mb-10 text-white" style={{backgroundColor: "#456c8d"}}>
                <Link to={"/"} className="font-bold text-2xl">Beenjasa</Link>
                <div className="flex gap-10">
                    <div className="">
                        <Link to={"/kompresor"}>List Kompresor</Link>
                    </div>
                    <div>
                        <Link to={"/pelanggan"}>List Pelanggan</Link>
                    </div>
                    <div className="">
                        <Link to={"/transaksi"}>List Transaksi</Link>
                    </div>
                </div>
            </div>
            
            <Outlet/>
        </>
    )
}