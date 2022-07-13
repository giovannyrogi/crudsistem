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
import InsertPage from './InsertData';
import UpdateData from './UpdateData';


const ListData = () => {

    const [listData, setListData] = useState([]);
    const [inserDataModal, setInserDataModal] = useState(false);
    const [updateDataModal, setUpdateDataModal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
     
    //mengambil ref data di database
    const listDataRef = collection(db, "daftartamu");
    
    //melakukan query data yang ada didatabase dan order by namalengkap
    const q = query(listDataRef, orderBy('tanggal', "desc"), limit(10));

    //useEffect akan lsng dijalankan saat page dibuka/reload
    useEffect(() => {

        getListData();

    }, [])

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

    //fungsi untuk edit data
    const editData = (nama, hadir, id) => {
        setSelectedData({
            id : id,
            namalengkap: nama,
            kehadiran: hadir
        });
        console.log(selectedData);

        if(selectedData !=''){
            setUpdateDataModal(true);
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
                                                    className='btn-edit'
                                                    onClick={() => {
                                                        editData(data.namalengkap, data.hadirharike, data.id)
                                                    }}
                                                >
                                                    <FaRegEdit 
                                                        size={20}
                                                    />
                                                </button>
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
            {updateDataModal && 
            <UpdateData 
                closeModal={setUpdateDataModal} 
                selectedData={setSelectedData}
            />}

            {/* kode html yang akan tampil di web */}
            <div className='listdata-container'>
                <div className='table-container'>
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