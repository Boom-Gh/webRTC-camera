import { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
// import './App.css'
const socket = io('http://192.168.0.101:3000');
export default function App(){
  const localVideoRef = useRef<HTMLVideoElement>(null)
  // const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pc = useRef<RTCPeerConnection>()
  const localStreamRef = useRef<MediaStream>()
  const textRef = useRef<HTMLTextAreaElement>(null)

  const getMediaDevices = ()=>{
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
      .then(stream =>{
        console.log('stream', stream);
        // 赋值表达式的左侧不能是可选属性访问。ts(2779)
        // localVideoRef.current?.srcObject = stream
        localVideoRef.current!.srcObject = stream
        localVideoRef.current!.play()
        localStreamRef.current = stream

        createRtcConnection()
      })
  }
  
  /**
   * 创建RTC连接
   */
  const createRtcConnection = ()=>{
    const _pc = new RTCPeerConnection({
      // iceServers: [{
      //   // 中继服务器？？？
      //   urls: ['stun:stun.stunprotocol.org:3478'],
      // }]
    })
    _pc.onicecandidate = (e)=>{
      if(e.candidate){
        console.log('candidate候选人', JSON.stringify(e.candidate))
        socket.emit("candidate", JSON.stringify(e.candidate));
      }
    }
    // _pc.ontrack = e => {
    //   remoteVideoRef.current!.srcObject = e.streams[0]
    // }
    pc.current = _pc
    console.log('rtc 连接创建成功', _pc)
    addLocalStreamToRtcConnection()
    createOffer()
  }

  const createOffer = () => {
    pc.current?.createOffer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    })
      .then(sdp => {
        console.log('offer', JSON.stringify(sdp))
        pc.current?.setLocalDescription(sdp)
        // wsSend('offer', JSON.stringify(sdp))
        // setStatus('等待对方接听')
        socket.emit('offer', JSON.stringify(sdp))
      })
  }

  // const sdpRef = useRef('asd')
  // const createAnswer = () => {
  //   pc.current?.createAnswer({
  //     offerToReceiveVideo: true,
  //     offerToReceiveAudio: true,
  //   })
  //     .then(sdp => {
  //       console.log('anser', JSON.stringify(sdp))
  //       pc.current?.setLocalDescription(sdp)
  //     })
  // }
  // socket.on('setAnswer', (answer)=>{
  //   console.log({answer});
  //   textRef.current!.value = answer
  //   setRemoteDescription()
  // })

  const setRemoteDescription =()=>{
    // const remoteSdp = JSON.parse(textRef.current!.value)
    // pc.current?.setRemoteDescription(new RTCSessionDescription(remoteSdp))
    // console.log('设置远程描述成功', remoteSdp);
    socket.emit('getAnswer')
    socket.on('setAnswer',(remoteSdp)=>{
      textRef.current!.value = remoteSdp
      pc.current?.setRemoteDescription(new RTCSessionDescription(JSON.parse(remoteSdp)))
    })
  }

  // const addCandidate = ()=>{
  //   const candidate = JSON.parse(textRef.current!.value)
  //   pc.current?.addIceCandidate(new RTCIceCandidate(candidate))
  //   console.log(
  //     '添加候选人成功',
  //     candidate
  //   );
  // }

  /**
   * 将本地视频流添加到 RTC 连接
   */
  const addLocalStreamToRtcConnection = () => {
    const localStream = localStreamRef.current!
    localStream.getTracks().forEach(track => {
      pc.current!.addTrack(track, localStream)
    })
    console.log('将本地视频流添加到 RTC 连接成功')
  }



  return  (
    <div>
      <button onClick={getMediaDevices}>获取摄像头和麦克风</button>
      <br />
      <video style={{width: '500px'}} ref={localVideoRef} ></video>
      <br />
    
      {/* <video style={{ width: '400px' }} ref={remoteVideoRef} autoPlay controls></video> */}
      {/* <br />
      <button onClick={createRtcConnection}>创建RTC 连接</button>
      <br />
      <button onClick={addLocalStreamToRtcConnection}>将本地视频添加到RTC</button>
      <br />
      <button onClick={createOffer}>创建 offer</button>
      <br /> */}
      <textarea ref={textRef}></textarea>
      <br />
      <button onClick={setRemoteDescription}>设置远程描述</button>
      {/* <button onClick={createAnswer}>创建Answer</button> */}
     
      {/* <br /> */}
      {/* <button onClick={addCandidate}>添加候选人</button> */}
    </div>
  )
}