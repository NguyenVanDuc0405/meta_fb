import React, { useState, useEffect } from 'react'
import axios from 'axios';
const Home = () => {
  const [message, setMessage] = useState('');
  const [ip, setIp] = useState('');
  const [city, setCity] = useState('');


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('https://ipapi.co/json/');
  //       setIp(response.data.ip);
  //       setCity(response.data.city);
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  const sendMessage = async () => {
    const response =
      axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=0b54578041c84e4684b6c0f2542c1721')
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });



    const API_URL = `https://api.telegram.org/bot7132569946:AAGNmy86xNs6x--A1OyDixdgE7be2kscibU/`;
    let message = `<b>Hi anh em, toi la NVD</b>`;
    let CURRENT_API_URL = API_URL + "sendMessage"
    try {
      await axios.post(CURRENT_API_URL, {
        chat_id: '5342791241',
        parse_mode: "html",
        document: '',
        text: message,
        caption: message,
      }, {
        headers: {
          "Content-Type": 'multipart/form-data',
        }
      });
    } catch (err) {
      console.log("err: ", err)
    }
  };
  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default Home