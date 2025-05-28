import React from 'react'
import { IoMdHome } from "react-icons/io";
import { IoTicketSharp } from "react-icons/io5";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { BiLineChart } from "react-icons/bi";
import { IoIosList } from "react-icons/io";
import { HiSpeakerphone } from "react-icons/hi";
import { IoMdGitBranch } from "react-icons/io";
import { RiContactsBookFill } from "react-icons/ri";
import { FaImage } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { GiPeriscope } from "react-icons/gi";
import { GiStarsStack } from "react-icons/gi";
import { RiLogoutBoxRFill } from "react-icons/ri";
const Sidebar = () => {
  return (
    <div className='sidebar justify-between'>
      <div>
        <div className='sidebar-icons'><GiPeriscope className="text text-green-700"/></div>
        <div className='sidebar-icons'><IoMdHome /></div>
        <div className='sidebar-icons'><BiSolidMessageSquareDots className="text text-green-700" /></div>
        <div className='sidebar-icons'><IoTicketSharp /></div>
        <div className='sidebar-icons'><BiLineChart /></div>
        <div className='sidebar-icons'><IoIosList /></div>
        <div className='sidebar-icons'><HiSpeakerphone /></div>
        <div className='sidebar-icons'><IoMdGitBranch /></div>
        <div className='sidebar-icons'><RiContactsBookFill /></div>
        <div className='sidebar-icons'><FaImage /></div>
        <div className='sidebar-icons'><MdChecklist /></div>
        <div className='sidebar-icons'><IoIosSettings /></div>
      </div>
      <div>
        <div className='sidebar-icons'><GiStarsStack /></div>
        <div className='sidebar-icons'><RiLogoutBoxRFill /></div>
      </div>
    </div>

  )
}

export default Sidebar
