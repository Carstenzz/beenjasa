import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage.js'
import ListPelanggan from './pages/pelanggan/ListPelanggan.js'
import ListKompersor from './pages/kompresor/ListKompresor.js'
import ListTransaksi from './pages/transaksi/ListTransaksi.js'
import reportWebVitals from './reportWebVitals';
import DetailPelanggan from './pages/pelanggan/DetailPelanggan.js';
import DetailKompresor from './pages/kompresor/DetailKompresor.js';
import DetailTransaksi from './pages/transaksi/DetailTransaksi.js';
import Navbar from './pages/navbar.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/pelanggan'>
        <Route index element={<ListPelanggan/>}/>
        <Route path=':dtl' element={<DetailPelanggan/>}/>
      </Route>
      <Route path='/kompresor'>
        <Route index element={<ListKompersor/>}/>
        <Route path=':dtl' element={<DetailKompresor/>}/>
      </Route>
      <Route path='/transaksi'>
        <Route index element={<ListTransaksi/>}/>
        <Route path=':dtl'>
          <Route index element={<DetailTransaksi/>}/>
          <Route path=':action' element={<DetailTransaksi/>}/>
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
