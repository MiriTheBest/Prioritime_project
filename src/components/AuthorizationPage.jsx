import React from 'react';

function AuthorizationPage({ onAuthorization }) {
  return (
    <div className="authorization-page">
      <div className="header">
        <h1>Welcome to <span>Prioritime</span></h1>
        <img src="/images/icon.png" alt="Prioritize App Icon" className="responsive-icon"/>
      </div>
      <div className="content">
        <h2>Let's set up your account</h2>
        <div className="authorization-options">
          <button onClick={() => onAuthorization(true)}>Continue with Google</button>
          <button onClick={() => onAuthorization(true)}>Continue with Email</button>
          <button onClick={() => onAuthorization(true)}>Continue with Apple</button>
          <button onClick={() => onAuthorization(true)}>Continue with Facebook</button>
        </div>
      </div>
    </div>
  );
}

export default AuthorizationPage;
