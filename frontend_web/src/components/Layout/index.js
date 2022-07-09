import React from 'react'
import Navbar from '../Navbar';



/**
* @author
* @function Layout
**/

const Layout = (props) => {

  return(
    <div>
        <Navbar />
        {props.children}
    </div>
   )

 }

 export default Layout;