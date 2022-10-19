import { Fragment, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '../config.js';

export const App = () => {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [player, setPlayer] = useState(undefined);
  const [device, setDevice] = useState(undefined);
  const [devices, setDevices] = useState([]);

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
      .get('https://api.spotify.com/v1/me/player/devices', { headers: header })
      .then(result => {
        console.log('player res', result.data.devices);
        setDevices(result.data.devices);
      })
      .catch(error => {
        console.error(error);
      });
  }, [token]);

  const selectDevice = useCallback((idx) => {
    setDevice(devices[idx]);
  }, [devices]);

  const play = useCallback((uri) => {
    if (!token || !device) {
      return;
    }
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .put(`https://api.spotify.com/v1/me/player/play?device_id=${device.id}`, {uris: [uri]}, { headers: header })
      .then(result => {
        console.log('player res', result);
      })
      .catch(error => {
        console.error(error);
      });
  }, [token, device]);

  return (
    <>
      <h1 className="text-3xl font-bold underline">hello world</h1>
      <h2 className="mt-32 text-xl font-bold">device</h2>
      <div className="flex space-x-16">
        {devices.map((d,key) => (
          <div
            className="border"
            key={d.id}
            onClick={() => selectDevice(key)}
          >
            <div>{d.name}</div>
            <div>{d.type}</div>
            {d.id === device?.id && (
              <div className="text-red-600">selected</div>
            )}
          </div>
        ))}
      </div>
      <h2 className="mt-32 text-xl font-bold">playlist name: {playlists.name}</h2>
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
            onClick={() => play(item.track.uri)}
          >ボタン</div>
        </div>
      ))} 
    </>
  );
}
