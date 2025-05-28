import React from 'react'
import { HiUser } from "react-icons/hi2";
import { ImPhone } from "react-icons/im";

interface ContactProps{
    id: string;                    
    name: string;
    contactNumber: string;
    lastMessagerName?: string;
    lastMessage?: string;           
    timestamp?: string;             
    isActive?: boolean;             
}
const Contact : React.FC<ContactProps> = ({name, contactNumber, lastMessage, isActive}) => {
  return (
    <article className={` cursor-pointer ${isActive? 'bg-gray-100': ''}`}> 
        <div className='flex'>
            <div className='flex items-center mb-2'>
                <div className='p-4 m-1 ml-2 bg-gray-200 border-white rounded-4xl'>
                    <HiUser className='text-white' />
                </div>  
            </div>
            <div className='contact-details p-2 mb-2 w-full'>      
                    <p className='text-[0.9rem] font-bold'>{name}</p>
                    <span className='text-[0.9rem] text-gray-400'>{lastMessage?.substring(0,50)}</span>
                    
                    <div className='flex items-center justify-between mt-1'>
                        <div className='flex items-center bg-gray-200 pl-2 pr-2 border border-gray-200 rounded-md'>
                            <ImPhone className='text-[0.5rem] text-gray-400' />
                            <p className='text-[0.65rem] text-gray-400 ml-1'> {contactNumber}</p>
                        </div>                        
                        <p className='text-xs text-gray-400'>28-May-25</p>
                    </div>

            </div>
        </div>
    </article>
  )
}

export default Contact
