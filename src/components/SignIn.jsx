import React from 'react'
import {environment} from '../environment'
import Cookies from 'js-cookie'

const SignIn = () => {

  const handleClick = () => {
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    
    const end_point = 'https://access.line.me/oauth2/v2.1/authorize'
    const response_type = encodeURIComponent('code')
    const client_id = environment.line.login.channel_id
    const redirect_uri = encodeURIComponent(window.location.origin + '/redirect')
    const state = chars.join("")
    const scope = encodeURIComponent('openid profile')
    const url = `${end_point}?response_type=${response_type}&client_id=${client_id}&`
          + `redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

    Cookies.set('auth_state', state)
    
    window.location.href = url
  }
  return (
    <button onClick={handleClick}>
      sign in
    </button>
  )
}

export default SignIn
