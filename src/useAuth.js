import {useState, useEffect} from "react";
import axios from "axios"; 

//Access token is needed to do everything in the spotify spotifyApo
//We get the accesstoken from our server 
//This function calls our server
export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    //When we initially login, we call the server to get the access token
    //To get an access token, we need to send the authentication code that we got when we signed in
    //This authentication "code" was at put into our url 
    useEffect(() => { 
        axios.post("http://localhost:3001/login", {code}) //This is the authentication code we send
            .then(res => { //res.data is the json object returned from our server 
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken); //The refresh token is used to get a new access token when the access token expires 
                setExpiresIn(res.data.expiresIn); //The expires in time is the time the access token expires in 
                window.history.pushState({}, null, "/"); //This cleans the url because the url has the code
            })
            .catch(() => {
                window.location = "/"; //Sends us back to the root directory after authenticating
            })
    }, [code]); 

    //When the access token does expire, we need to get a new access token
    //We use the refresh token to get the new access token
    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {
            axios.post("http://localhost:3001/refresh", {refreshToken}) //We send refresh token to the server
            .then(res => {
                setAccessToken(res.data.accessToken);
                setExpiresIn(res.data.expiresIn); 
            })
            .catch(() => {
                window.location = "/";
            });
        }, (expiresIn - 60) * 1000);
        return () => clearInterval(interval); 
    }, [refreshToken, expiresIn]) //Only runs effect if these elements are different
    return accessToken;
}