import { useEffect, useState } from 'react';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '../config.js';

export const App = () => {
  const [items, setItems] = useState([]);
  const [token, setToken] = useState([]);

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

    axios.post('https://accounts.spotify.com/api/token', data, headers)
         .then((response) => {
          console.log('access_token', response);
          setToken(response.data.access_token);
         })
         .catch((error) => {
           return 'ERROR getAccsessToken';
         });
  }, []);

  useEffect(() => {
    console.log('get', token);
    if (!token || !token.length) {
      console.log('stop');
      return;
    }
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50', { headers: header })
      .then(res => {
        console.log('res', res);
        const _items = res.data.items.map((item) => {
          const imageUrl = item.images?.length
            ? item.images[item.images.length - 1].url
            : 'noimage';
          const info = {
            id: item.id,
            name: item.name,
            artist_url: item.external_urls?.spotify,
            image_url: imageUrl,
          };
          return info;
        });
        return _items;
      })
      .then(
        (result) => {
          setItems(result);
        },
        (error) => {
          console.error(error);
        }
      )
  }, [token]);

  return (
    <>
      <div className="text-3xl font-bold underline">hello world</div>
      {items.map(item => (
        <div>{item.name}</div>
      ))} 
    </>
  );
}
