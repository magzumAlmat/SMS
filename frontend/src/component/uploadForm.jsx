import React,{useRef} from 'react'
import {upload} from './api'
import T from 'prop-types'

const UploadForm=({onUpdate})=>{
const inputEl= useRef(null)


const _onSuccess=(data)=>{
    
    onUpdate(data.link)
    
    console.log(data)}

const _onFailure=()=>{ onUpdate(null)}

const onUpload=e=>{
    e.preventDefault();
    console.log(inputEl.current.files[0]);

    upload(inputEl.current.files[0],_onSuccess,_onFailure);



}
return (
     <div>
    <form onSubmit={onUpload}>
        <input type="file" ref={inputEl}/>
        <button type="submit" >Upload</button>
    </form>
    
    

    </div>
)



}



UploadForm.propTypes={
  onUpload:T.func.isRequired,  
}


export {UploadForm}