import React, { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { useNavigate, useParams } from 'react-router';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {

  const [client, setClient] = useState(null);
  const [call, setCalll] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser } = useAuthUser();

  const { id: callId } = useParams();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser   //  we use !! to convert in to Boolean  
  });

  useEffect(() => {

    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;

      try {

        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true })

        console.log("Joined call successfully");

        setClient(videoClient)
        setCalll(callInstance);
      } catch (error) {
        console.error("Error joining call : ", error);
        toast.error("could not join the call. please try again.");
      } finally {
        setIsConnecting(false);
      }
    }

    initCall();
  }, [tokenData, authUser, callId]);





  return (
    <div className='h-screen flex flex-colitems-center justify-center'>
      <div className='relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='felx items-center justify-center h-full'>
            <p>Could no initialize call. Please refresh or try again. </p>
          </div>
        )

        }

      </div>
    </div>
  )
}

export default CallPage


const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )

}