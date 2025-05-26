import React from 'react'
import bg from '../public/doodle.jpg'
// import { useEffect } from 'react'

interface ChatProps{
    type : string,
    members?: any,

}
const Chat = () => {
  return (
    <div className="flex flex-col h-full">  {/* full height of parent */}
      <div className='h-12 bg-yellow-200'>
        {/* Header */}
      </div>

      <div className="flex-1 bg-[url('/doodle2-3.jpg')] bg-repeat overflow-auto">
        {/* Chat content fills remaining space */}
        
      </div>

      <div className='min-h-12 bg-gray-300'>
        {/* Controls, fixed height */}
        
      </div>
    </div>
  )
}

export default Chat
