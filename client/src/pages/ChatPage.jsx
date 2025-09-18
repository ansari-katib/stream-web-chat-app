import React, { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react"
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoading from '../components/ChatLoading';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { id: targetUserId } = useParams();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser   //  we use !! to convert in to Boolean  
  });

  // console.log("token data : ",tokenData);

  useEffect(() => {

    const initChat = async () => {
      try {
        if (!tokenData?.token || !authUser) return;

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token);

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChannel(currentChannel);

      } catch (error) {
        console.log("Error in chat page : ", error);
        toast.error("could not connect to chat . please try again");

      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [targetUserId, authUser, tokenData]);

  if (loading || !chatClient || !channel) return <ChatLoading />


  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
