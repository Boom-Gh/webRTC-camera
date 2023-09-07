import {  useRef } from 'react'
import { io } from "socket.io-client";

const socket = io('http://192.168.0.101:3000');
export default function Client(){
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pc = useRef<RTCPeerConnection>()
  const textRef = useRef<HTMLTextAreaElement>(null)

  const createRtcConnection = ()=>{
    const _pc = new RTCPeerConnection({
      // iceServers: [{
      //   // 中继服务器？？？
      //   urls: ['stun:stun.stunprotocol.org:3478'],
      // }]
    })
    // _pc.onicecandidate = (e)=>{
    //   if(e.candidate){
    //     console.log('candidate候选人', JSON.stringify(e.candidate))
    //   }
    // }
    _pc.ontrack = e => {
      remoteVideoRef.current!.srcObject = e.streams[0]
    }
    pc.current = _pc
    console.log('rtc 连接创建成功', _pc)
    socket.emit('getOffer')

    socket.on('setOffer', (offer)=>{
      textRef.current!.value = offer
      setRemoteDescription()
    })
    
    socket.on('setCandidate', (candidate)=>{
      // textRef.current!.value = candidate
      console.log(candidate[0])
      addCandidate(candidate[0])
    })
    
  }

  const createAnswer = () => {
    pc.current?.createAnswer({
      offerToReceiveVideo: true,
      offerToReceiveAudio: true,
    })
      .then(sdp => {
        console.log('anser', JSON.stringify(sdp))
        pc.current?.setLocalDescription(sdp)
        socket.emit("answer", JSON.stringify(sdp));
        // socket.on('setCandidate', (candidate)=>{
        //   console.log(candidate)
        // })
      })
  }
  // socket.emit("answer", JSON.stringify({s: 1213}));
  // socket.on('setAnswer', (answer)=>{
  //   console.log('client', answer)
  // })
  

  const handleLive = ()=>{
    createRtcConnection()
  }
  
  const setRemoteDescription =()=>{
    const remoteSdp = JSON.parse(textRef.current!.value)
    pc.current?.setRemoteDescription(new RTCSessionDescription(remoteSdp))
    console.log('设置远程描述成功', remoteSdp);
    createAnswer()
  }

  const addCandidate = (value: string)=>{
    const candidate = JSON.parse(value)
    pc.current?.addIceCandidate(new RTCIceCandidate(candidate))
    console.log(
      '添加候选人成功',
      candidate
    );
  }

  return (
    <div>
      <video style={{ width: '400px' }} ref={remoteVideoRef} autoPlay controls></video>
      <br />
      <button onClick={ handleLive } >进入直播</button>
      <br />
      <textarea ref={textRef}></textarea>
      <br />
      {/* <button onClick={setRemoteDescription}>设置远程描述</button> */}
      {/* <button onClick={createAnswer}>创建Answer</button> */}
     
      <br />
      {/* <button onClick={addCandidate}>添加候选人</button> */}
    </div>
  )
}