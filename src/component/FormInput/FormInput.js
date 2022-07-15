import {useState} from 'react'
import "./formInput.css"

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const {label, errorMessage, onChange, id, ...inputProps} = props;

    const handleFocus = () => {
        setFocused(true);
    }

  return (
    <div className='formInput'>
        <label className='txt-label' >{label}</label>
        <input 
           {...inputProps}
           onChange={onChange}
           onBlur={handleFocus}
          //  onFocus={() => inputProps.name === ""}
           focused={focused.toString()}
        />
        <span>{errorMessage}</span>
    </div>
  )
}

export default FormInput;
