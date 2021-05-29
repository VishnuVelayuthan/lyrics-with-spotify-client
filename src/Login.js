import React from "react";
import Container from "react-bootstrap"

const client_id = "0c9eb454ffc2431cabd8ddc114204945"; 
const redirect_uri = "http://localhost:3000"
const scopes = `streaming%20user-read-email%20user-read-private%20user-
library-read%20user-library-modify%20user-read-playback-state%20
user-modify-playback-state`;

const AUTH_URL = `https://accounts.spotify.com/authorize
    ?client_id=`+client_id+`&response_type=code&redirect_uri=`+redirect_uri+`
    &scope=`+scopes;

export default function Login() {

    return (
        <div>

        </div>
    )
}