import React from 'react'
import { HiUser } from "react-icons/hi2";
import { ImPhone } from "react-icons/im";

interface ContactProps{
    name: string,
    contactNumber: string
}
const Contact : React.FC<ContactProps> = ({name, contactNumber}) => {
  return (
    <div className=''> 
        <div className='flex'>
            <div className='flex items-center mb-2'>
                <div className='p-3 m-1 bg-gray-200 border-white rounded-4xl'>
                    <HiUser className='text-white' />
                </div>
                
            </div>
            <div className='contact-details p-2 mb-2'>      
                    <p className='text-[0.9rem] font-bold'>{name}</p>
                    <p className='text-gray-400'> <span>last messagner :</span> <span>last message from the messa</span></p>
                    <div className='flex justify-between'>
                        <div className='flex items-center bg-gray-200'>
                            <ImPhone className='text-[0.5rem]' />
                            <p className='text-xs text-gray-500 ml-1'> {contactNumber}</p>
                        </div>                        
                        <p className='text-xs'>22 May 2025</p>
                    </div>
            </div>
        </div>
        
    </div>
    
  )
}

export default Contact
