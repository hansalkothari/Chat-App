'use client';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase-client';
import { IoMdSend } from "react-icons/io";
import { HiUser } from "react-icons/hi2";
import { ImPhone } from "react-icons/im";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoIosVideocam } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { RiAttachment2 } from "react-icons/ri";
import { VscSmiley } from "react-icons/vsc";
import { MdOutlineAccessTime } from "react-icons/md";
import { PiClockClockwise } from "react-icons/pi";
import { HiDocumentText } from "react-icons/hi";
import { FaMicrophone } from "react-icons/fa";
import { GiPeriscope } from "react-icons/gi";
import { RiExpandUpDownLine } from "react-icons/ri";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatProps {
  conversationId: string | null;
  contact: { id: string; username: string, last_seen:string | null | undefined };
}

export default function Chat({ conversationId, contact }: ChatProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // get current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);


  useEffect(() => {
    if (!conversationId) return;
    
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []));

    
    const chan = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        ({ new: m }) => setMessages((prev) => [...prev, m as Message])
      )
      .subscribe();

    

    return () => {
      supabase.removeChannel(chan);
    };
  }, [conversationId]);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  const send = async () => {
    if (!body.trim() || !userId || !conversationId) return;
    
    const { data: inserted, error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: body.trim(),
    }).select('*').single();
    if (error) {
      console.error('Error sending message:', error);
    } else if (inserted) {
      setMessages((prev) => [...prev, inserted]);
    }
    
    setBody('');
  };

  return (
    <div className="flex flex-col h-full">
      
      <div className="h-14 flex items-center justify-between px-4 font-semibold border-b-1 border-gray-200">  
          <div className='flex items-center'>
            <div className='flex items-center m-1'>
                  <div className='p-3 m-1 ml-2 bg-gray-200 border-white rounded-4xl'>
                      <HiUser className='text-white' />
                  </div>  
            </div>
            <div>
              <p>{contact.username}</p>
              <p className='text-gray-300 text-xs'>12:13 PM</p>
            </div>
          </div>
          <div className='flex'>
            <BsStars className='text-xl text-yellow-300 mr-6 ' />
            <ImPhone className='text-xl mr-6 ' />
            <IoIosVideocam className='text-xl mr-6 '/>
            <HiMiniMagnifyingGlass className='text-xl mr-6 '/>
          </div>
      </div>

      
      <div className="flex-1 bg-[url('/doodle.jpg')] bg-repeat overflow-auto p-4">
        {messages.map((m) => {
          const isMe = m.sender_id === userId;
          return (
            <div
              key={m.id}
              className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg ${
                  isMe
                    ? 'bg-[#dcf8c6] text-black rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap  [overflow-wrap:anywhere]">{m.content}</p>
                <span className="block text-xs mt-1 text-gray-600 text-right">
                  {new Date(m.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      
      <div className="min-h-12 flex items-center px-4 py-2">
        <input
          type="text"
          className="flex-1 rounded-full px-4 py-2 mr-2 focus:outline-none"
          placeholder="Message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          className="p-2 rounded-full text-green-600 disabled:opacity-50 cursor-pointer"
          disabled={!body.trim()}
        >
          <IoMdSend className='text-2xl text-green-800' />
        </button>
      </div>
      <div className='h-12 flex items-center justify-between'>
        <div className='flex'>
          <RiAttachment2 className='text-[1.1rem] ml-4 mr-2 text-gray-600'/>
          <VscSmiley className='text-[1.1rem] ml-4 mr-2 text-gray-600'/>
          <MdOutlineAccessTime className='text-[1.1rem] ml-4 mr-2 text-gray-600'/>
          <PiClockClockwise className='text-[1.1rem] ml-4 mr-2 text-gray-600'/>
          <HiDocumentText className='text-[1.1rem] ml-4 mr-2 text-gray-600'/>
          <FaMicrophone className='text-[1.0rem] ml-4 mr-2 text-gray-600'/>
        </div>
        <div className='flex mr-8 p-1 pl-2 items-center border-1 border-gray-200 rounded-xs'>
          <div className='bg-green-600 pt-1 pr-1 rounded-4xl mr-1'><GiPeriscope className='text-white'/></div>
          <p className='mr-20 text-[0.9rem]'>Periskope</p>
          <RiExpandUpDownLine className='text-gray-400'/>
        </div>
      </div>

    </div>
  );
}
