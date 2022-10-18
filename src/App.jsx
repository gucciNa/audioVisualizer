import { Fragment, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '../config.js';

export const App = () => {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [player, setPlayer] = useState(undefined);

  useEffect(()  => {
    const authToken = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const headers = {
      headers: {
        Authorization: 'Basic ' + authToken,
      }
    };

    const data = new URLSearchParams([
      ['grant_type', 'refresh_token'],
      ['refresh_token', SPOTIFY_REFRESH_TOKEN]
    ]).toString();

    axios
      .post('https://accounts.spotify.com/api/token', data, headers)
      .then((response) => {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        return 'ERROR getAccsessToken';
      });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('https://api.spotify.com/v1/playlists/47shj2K6fabDjVfmNbFXeE', { headers: header })
      .then(result => {
        console.log('playlists', result.data);
        setPlaylists(result.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [token]);

  const play = useCallback(() => {
    console.log('player', player);
    //player.connect();
    //player.togglePlay();
  }, [player]);

  return (
    <>
      <div className="text-3xl font-bold underline">hello world</div>
      <div>playlist name: {playlists.name}</div>
      {playlists?.tracks?.items?.map(item => (
        <div
          className="w-full max-w-screen-sm flex justify-between items-center border"
          key={item.track.id}
        >
          <div className="flex justify-start">
            <div className="w-80 h-80">
              <img src={item.track.album.images[0].url} />
            </div>
            <div>
              <div className="text-xl font-bold">{item.track.name}</div>
              <div>{item.track.artists[0].name}</div>
            </div>
          </div>
          <div
            className="w-40 h-40 rounded-full bg-gray-500 border"
            onClick={play}
          >ボタン</div>
        </div>
      ))} 
    </>
  );
}
