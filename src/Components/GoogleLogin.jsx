import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

const GoogleLoginComponent = ({ onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    console.log('Google response:', response);
    if (response.credential) {
      const resultAction = await dispatch(googleLogin(response.credential));
      if (googleLogin.fulfilled.match(resultAction)) {
        onLogin();
        navigate('/');
      } else {
        console.error('Google login failed:', resultAction.payload);
      }
    } else {
      console.error('Login failed:', response);
    }
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    color: 'black',
    border: '2px solid white',
    borderRadius: '20px',
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Roboto, Arial, sans-serif',
    transition: 'background-color 0.3s, color 0.3s',
    width: '100%',
    maxWidth: '240px',
    height: '40px',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GoogleOAuthProvider clientId="368682942247-qlf3mcr8l4n6f97qeuuoalsp01hvigc6.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => console.log('Login Failed')}
          useOneTap
          type="standard"
          theme="filled_black"
          shape="rectangular"
          text="signin_with"
          size="large"
          width="240"
          logo_alignment="left"
          render={({ onClick, disabled }) => (
            <button
              onClick={onClick}
              disabled={disabled}
              style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Sign in with Google
            </button>
          )}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginComponent;