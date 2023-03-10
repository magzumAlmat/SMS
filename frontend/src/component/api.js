import React from 'react'
const upload=(file,onSuccess,onFailure)=>{

    const data=new FormData()
    data.append('file',file)

    fetch('https://file.io/?expires=1w',{
        method:'POST',
        mode:'cors',
        // header:{'Content-Type':undefined,},
         body:data,
        // body:file,
})

.then(response=>{
    if(response.ok){return response.json()} else
    {throw new Error (response.status)}
})

.then(data=> onSuccess(data))
.catch(error=>{
    onFailure()
})

}

export{upload}