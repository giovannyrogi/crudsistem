import {useState} from "react";
import {db} from "../firebaseConfig";
import {collection, getDocs, addDoc} from "firebase/firestore";
import style from "./style.css"

const UpdateData = ({closeModal, selectedData}) => {

    const [nama, setNama] = useState("");
    const [kehadiran, setKehadiran] = useState("");
    const [message, setMessage] = useState(false);

    const daftarTamuRef = collection(db, "daftartamu");
    

    // melakukan format, jika nilai dar hari/bulan < 10
    // maka akan otomatis menambah angka 0 didepannya
    const formatTime = (time) => {
        return time < 10 ? `0${time}`: time;
    }

    //fungsi untuk mereset form
    const resetForm = () => {
        var namaLengkap = document.getElementById("nama");
        var hariKe = document.getElementById("hadir");

        namaLengkap.value = "";
        hariKe.value = "";

        setNama("");
        setKehadiran("");
    }

    const insertData = async (e) => {
        e.preventDefault();
        console.log(selectedData);

        // validasi form
        if(nama === "" && kehadiran === ""){
            //alert("Nama Lengkap & Hadir Hari Ke tidak boleh kosong.");
            setMessage(true);
        }
        else if (nama === "" ){
            //alert("Nama Lengkap tidak boleh kosong.");
            setMessage(true);
        }
        else if(kehadiran === ""){
            //alert("Hadir Hari Ke tidak boleh kosong.");
            setMessage(true);
        }
        else{
            //untuk mendapatkan tanggal sekarang
            const date = new Date();

            const day = formatTime(date.getDate());
            const month = formatTime(date.getMonth() + 1);
            const year = date.getFullYear();
            var currentDate = `${day}-${month}-${year}`; // cth output : 4-7-2022

            //mengirim data ke database
            try {
                await addDoc(daftarTamuRef, {
                    namalengkap: nama,
                    hadirharike: kehadiran,
                    tanggal: currentDate
                });
                alert("Data berhasil ditambahkan.");
                // setMessage(true);
                resetForm();
            } catch (err) {
                alert("Error : ", err.message);
                
            } 
            
        }
        
        
    }

    return(
        <>
            <div className="container">
                <form onSubmit={insertData} className="form-container">
                    <div className="title-container">
                        <h2>UPDATE DATA</h2>
                    </div>
                    <div className="input-field">
                        <label>Nama lengkap</label>
                        <input 
                            type="text" 
                            className="a"
                            id="nama"
                            onChange={(event) => {
                                setNama(event.target.value);
                            }}
                            placeholder="Contoh : Giovanni Syalala"
                        />
                    </div>

                    {/* menampilkan pesan error jika field pada nama lengkap kosong */}
                    {message && nama == '' ? 
                    <label className="error-msg">Nama Lengkap tidak boleh kosong.</label> : "" }
                    
                    <div className="input-field">
                        <label>Hadir hari ke</label>
                        <input 
                            type="number" 
                            className="a"
                            id="hadir"
                            onChange={(event) => {
                                setKehadiran(event.target.value);
                            }}
                            min="1"
                            max="7"
                            maxLength={1}
                            placeholder="Cmn Isi Angka : 1-7"
                        />   
                    </div>

                    {/* menampilkan pesan error jika field pada hadir hari ke kosong. */}
                    {message && kehadiran == '' ? 
                    <label className="error-msg">Hanya blh angka 1-7 dan tidak blh kosong.</label> : "" }
                    
                    <div className="input-field">
                        <button 
                            type="submit" 
                            className="btn-insert">
                            UPDATE DATA</button>
                    </div>


                    <div className="cekdata-container">
                        <a 
                        onClick={() => closeModal(false)}
                            href="" 
                            className="cek-data"
                            >Cek Data</a>
                    </div>
                </form>
            </div>
        </>
    )
}

export default UpdateData;