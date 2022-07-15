import {useState, useEffect} from "react";
import {db} from "../firebaseConfig";
import {collection, getDocs, addDoc, onSnapshot} from "firebase/firestore";
import FormInput from "../FormInput/FormInput";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = ({closeModal}) => {
    
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const daftarTamuRef = collection(db, "users");

    // useEffect(() => {
      
    //     getUsersData();

    // }, [])
    
    

    const inputs = [
        {
            id:1,
            name:"email",
            type:"text",
            placeholder:"email. . .",
            // errorMessage: "Usernama tidak blh kosong!",
            label:"Email",
            // pattern: usersList[0].email,
            // required: true
        },
        {
            id:2,
            name:"password",
            type:"password",
            placeholder:"Password. . .",
            // errorMessage: "Password tidak blh kosong!",
            label:"Password",
            // pattern: usersList[0].password,
            // required: true
        }
    ]

    const resetForm = () => {
        setValues({
            email: "",
            password: ""
        });
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            alert("Login Berhasil");
            resetForm();
            closeModal(false);
        } catch (error) {
            alert(error.message);
        }
    }
    
    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    
    return(
            <div className="container">
                <form className="form-container" onSubmit={handleLogin}>
                    <h1 className="login-title">LOGIN</h1>
                    {inputs.map((input) => (
                        <FormInput 
                            key={input.id} 
                            {...input}  
                            value={values[input.name]}
                            onChange={onChange}
                        />
                    ))}
                    <button className="btn-Login">Login</button>
                </form>
            </div>
    )
}

export default Login;