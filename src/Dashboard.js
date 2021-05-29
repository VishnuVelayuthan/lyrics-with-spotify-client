import {useState, useEffect} from "react";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import {Container, Form} from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
    clientId: "0c9eb454ffc2431cabd8ddc114204945"
}); 

export default function Dashboard({code}) {
    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState(""); 

    const accessToken = useAuth(code); 

    const chooseTrack = (track) => {
        setPlayingTrack(track);
        setSearch("");
        setLyrics(""); 
    }

    useEffect(() => {
        if(!playingTrack) return;
        axios.get("http://localhost:3001/lyrics", {
            params : {
                track: playingTrack.title,
                artist: playingTrack.artist
        }}).then((res) => {
            setLyrics(res.data.lyrics); 
        })
    }, [playingTrack]);

    //When access token changes, set api's access token
    useEffect(() => {
        spotifyApi.setAccessToken(accessToken); 
    }, [accessToken])

    //When the input in the search bar changes, 
    useEffect(() => {
        if(!search) return setSearchResults([]);
        if(!accessToken) return;
        
        if(search === "helo") setSearch("hello");

        let cancel = false;
        spotifyApi.searchTracks(search).then(res => {
            if(cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                    (smallest, image) => {
                        if (image.height < smallest.height) return image;
                        return smallest;
                    }
                )
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }));
        });
        return () => cancel = true; 
    }, [search, accessToken])


    return (
        <Container className="d-flex flex-column py-2" style={{height: "100vh"}}>
            <Form.Control 
                type="search" 
                placeholder="Search Songs/Artists"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2" style={{overflowY: "auto"}}>
                {searchResults.map((track) =>
                    <TrackSearchResult 
                        key={track.uri} 
                        track={track} 
                        chooseTrack={chooseTrack}
                    />
                )}
                {searchResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre"}}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
        </Container>
    )
}
