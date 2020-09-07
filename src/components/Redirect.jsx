import React, {useEffect} from 'react'
import {withRouter} from 'react-router'
import Cokkies from 'js-cookie'
import {environment} from '../environment'
import {auth} from '../firebaseIndex'
import axios from 'axios'

const Redirect = ({history}) => {

  
  useEffect(()=>{
    const query = window.location.search.slice(1)
    const queries = {}
    
    if (!query) {
      history.push('/signin')
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
      history.push('/signin')
    }

    const code = queries['code'];
    const state = queries['state'];

    if (state !== Cokkies.get('auth_state')) {
      console.error('state is wrong');
      history.push('/signin')
    }

    const redirect_uri = `${window.location.origin}/redirect`

    const url = `${environment.cloud_functions.host_name}/lineLogin`
    const body = {
      code: code,
      redirect_uri: redirect_uri
    }
    let customToken
    axios.post(url, body).then(res => {
      console.log(res)
      customToken = res.data.firebase_token
      auth.signInWithCustomToken(customToken).then(res=>{
        history.push("/")
      })
        .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
    })
    
  }, [])
  
  return(
    <div>
      <h2>Sign in processing...</h2>
    </div>
  )
}


export default withRouter(Redirect)
