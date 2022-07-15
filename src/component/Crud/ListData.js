import {useEffect, useState} from 'react';
import { db } from '../firebaseConfig';
import {
            collection, 
            doc,
            getDocs, 
            addDoc, 
            query, 
            onSnapshot,
            orderBy,
            limit,
            where,
            deleteDoc
        } from "firebase/firestore";

import { 
            FaSearch, 
            FaFolderPlus, 
            FaRegTrashAlt, 
            FaEdit,
            FaRegEdit 
        } from "react-icons/fa";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import InsertPage from './InsertData';
import Login from './Login';


const ListData = () => {

    const [listData, setListData] = useState([]);
    const [inserDataModal, setInserDataModal] = useState(false);
    const [LoginModal, setLoginModal] = useState(true);
    
    const [user, setUser] = useState({});

    //mengambil ref data di database
    const listDataRef = collection(db, "daftartamu");
    
    //melakukan query data yang ada didatabase dan order by namalengkap
    const q = query(listDataRef, orderBy('tanggal', "desc"));

    //useEffect akan lsng dijalankan saat page dibuka/reload
    useEffect(() => {

        getListData();

        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser != "" && currentUser != null){
                setUser(currentUser);
                setLoginModal(false);
            }
            else{
                setLoginModal(true);
            }
        });
    }, [])


    //funsi untuk logout dari akun yg sedang login
    const logout = async() => {
        await signOut(auth);
        setLoginModal(true);
        
    }

    //fungsi untuk query data pada tabel dengan menggunakan nama lengkap
    const searchData = async (value) => {
        // console.log(value);
        const quaryData = query(listDataRef, where("namalengkap", "==", value));

        if(value != ''){
            try {
                onSnapshot(quaryData,(querySnapshot) => {
                    var listTamu = [];
                    querySnapshot.forEach(doc => {
                        listTamu.push({
                            ...doc.data(),
                            id: doc.id
                        });
                        setListData(listTamu);
                    });
                })
            } catch (error) {
                console.log("error : ", error);
            }
        }
        else{
            getListData();
        }
        
    }

    //fungsi untuk melakukan delete data
    const deleteData = async (id) => {
        const listTamuDoc = doc(db, "daftartamu", id);

        try {
            alert("Data berhasil dihapus.");
            await deleteDoc(listTamuDoc);
        } catch (error) {
            console.log("error : ", error);
        }
    }

    //fungsi untuk mendapatkan data yang ada didatabase
    const getListData = async () => {
        try {
            onSnapshot(q,(querySnapshot) => {
                var listTamu = [];
                querySnapshot.forEach(doc => {
                    listTamu.push({
                        ...doc.data(),
                        id: doc.id
                    });
                    setListData(listTamu);
                });
            })
        } catch (error) {
            console.log("error : ", error);
        }
    }

    // fungsi untuk melakukan cek data
    // jika ada data, maka tampilkan data
    // jika tidak, maka tampilkan tidak ada data.
    const dataCheck = () =>{
        if(listData != ''){
            return(
                <>
                    {listData.map((data, index) => {
                        return <tbody>
                                    <tr key={index}>
                                        <td>{++index}</td>
                                        <td>{data.namalengkap}</td>
                                        <td>{data.hadirharike}</td>
                                        <td>{data.tanggal}</td>
                                        <td>
                                            <div className='btn-aksicontainer'>
                                                <button 
                                                    className='btn-trash'
                                                    onClick={() => {
                                                        deleteData(data.id);
                                                    }}
                                                >
                                                    <FaRegTrashAlt 
                                                        size={20}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                    })}
                </>
            )
        }
        else{
            return(
                <tbody>
                    <tr>
                        <td className='noData'></td>
                        <td className='noData'></td>
                        <td className='noData'><h3>Belum ada data.</h3></td>
                        <td className='noData'></td>
                        <td className='noData'></td>
                    </tr>      
                </tbody>      
            )
        }
    }

    return (
        <>
            {/* logic untuk menampilkan insert page jika nilai true */}
            {inserDataModal && <InsertPage closeModal={setInserDataModal} />}

            {/* logic untuk menampilkan update page jika nilai true */}
            {LoginModal && 
            <Login 
                closeModal={setLoginModal}
            />}

            <div className='listdata-container'>
                <div className='table-container'>
                    <div className='topmenu-container'>
                        <div className='user-container'>
                            <h5> Akun Login : {user?.email}</h5>
                        </div>
                        <div className='logout-container'>
                            <button className='btn-logout' onClick={logout}>Log Out</button>
                        </div>
                    </div>
                    <div className='header-container'>
                        <div className='btn-container'>
                            <button 
                                onClick={() => setInserDataModal(true)}
                                className='btn-tambahdata'>
                                <h3>Tambah Data</h3>
                                <FaFolderPlus 
                                    size={25}
                                    className='icon-plus'
                                />
                            </button>
                            
                        </div>
                        <div className='judul-container'>
                            <h1>DAFTAR TAMU KKR<br></br> 
                                GMAHK PERUM PANIKI DUA.
                            </h1>
                        </div>
                        <div className='search-container'>
                            <FaSearch 
                                color='#1d2630'
                                size={20}
                                className='icon-search'
                            />
                            <input 
                                type="text"
                                className='search-data'
                                onChange={(event) => {
                                    searchData(event.target.value);
                                }}
                                placeholder='Cari data. . .' 
                            />
                        </div>
                    </div>
                    <div className='list-data'>
                        <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Lengkap</th>
                                        <th>Hadir Hari Ke</th>
                                        <th>Tanggal</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                            {dataCheck()}
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListData;