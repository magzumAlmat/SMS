import React from 'react'
import T from 'prop-types'
const List=({data})=>{
    

    console.log(data)
    
    return   <div>{data.map(item=>{
    
    return(<ul>    <li>
                   <a href={item}>{item}</a>
                    </li>
           </ul>
           )
                                  })
               
              
               
               
                } </div>

}

List.propTypes={
    data:T.arrayOf(T.string)
}

export  default List;