import React, { useState } from 'react';
import {UploadForm} from './uploadForm';
import List from './List';
// import Status from './Status'
const MyCloud=()=> {

const [paths, setPaths] = useState([])

const [status,setStatus]=useState('')

const onUpdate=(path)=>{
   if(path){
    setStatus('OK')
    setPaths(paths.concat(path));
} else{
    setStatus('FAIL')
}
}

return(
 <div>
  <UploadForm onUpdate={onUpdate}/>
  <List data={paths}/>
  {/* <Status text={status}/> */}
  </div>)
}

export default MyCloud