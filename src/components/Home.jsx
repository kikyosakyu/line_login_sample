import React, {useEffect} from 'react'
import Cokkies from 'js-cookie'
import {environment} from '../environment'
import axios from 'axios'

const Home = () => {

  
  useEffect(()=>{
    const query = window.location.search.slice(1)
    const queries = {}
    
    if (!query) {
      window.location.href = window.location.origin
    } else {
      query.split('&').forEach((query) =>  {
        var queryArr = query.split('=');
        queries[queryArr[0]] = queryArr[1];
      });
    }

    const responded_error = queries['error'];
    const responded_error_description = queries['error_description'];

    if (responded_error) {
      console.error(responded_error_description);
      window.location.href = window.location.origin
    }

    const code = queries['code'];
    const state = queries['state'];

    if (state !== Cokkies.get('auth_state')) {
      console.error('state is wrong');
      window.location.href = window.location.origin
    }

    const redirect_uri = window.location.origin

    const url = `${environment.cloud_functions.host_name}/lineLogin`
    const body = {
      code: code,
      redirect_uri: redirect_uri
    }
    axios.post(url, body).then(res => {
      alert(res)
    })
    
  }, [])
  
  return(
    <div>
      {window.location.search}
      {(Cokkies.get('auth_state'))}
    </div>
  )
}


export default Home
