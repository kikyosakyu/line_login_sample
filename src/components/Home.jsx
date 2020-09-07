import React, {useEffect, useContext, useState} from 'react'
import {withRouter} from 'react-router'
import {AuthContext} from '../auth/AuthProvider'
import {auth} from '../firebaseIndex'



const Home = ({history}) => {
  const {currentUser} = useContext(AuthContext)
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  
  useEffect(()=>{
    if(currentUser != null) {
      console.log(currentUser)
      setDisplayName(currentUser.displayName)
      setPhotoURL(currentUser.photoURL)
    }
    
  }, [])
  
  return(
    <div>
      <h2>Home</h2>
      <p>hello {displayName}!!</p>
      <img src={photoURL}/>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  )
}


export default withRouter(Home)
