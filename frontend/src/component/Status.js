import React from 'react'
import T from 'prop-types'
const Status=()=>{
    return (<h6> Status:  {text}</h6>);
}

Status.propTypes={text:T.string.isRequired,}
export default Status