import React from 'react'
import ReactDOM from 'react-dom/client'
import VConsole from 'vconsole';
import App from './App'
import './index.css'
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// 根据设备类型进行相应的操作
if (isMobile) {
  // 手机访问
  console.log("This is a mobile device");
  const vConsole = new VConsole({ theme: 'dark' });
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
