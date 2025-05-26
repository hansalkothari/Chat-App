import React from "react";
import { BiSolidMessageSquareDots } from "react-icons/bi";
import { TbRefreshDot  } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RiExpandUpDownLine } from "react-icons/ri"; 
import { FaStar } from "react-icons/fa";
import { TbDeviceDesktopDown } from "react-icons/tb";
import { IoMdNotificationsOff } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { IoIosList } from "react-icons/io";

const Top = () => {
  return (
    <div className="top flex items-center justify-between">
      <div className="flex items-center ml-4">
        <BiSolidMessageSquareDots className="text text-gray-400" />
        <p className="text text-gray-400 ml-1"> chats</p>
      </div>

      <div className="flex ">
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-xs"><TbRefreshDot className="mr-1 ml-2"/><p className="mr-2">Refresh</p></div>
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-xs"><IoIosHelpCircleOutline className="mr-1 ml-2"/> <p  >Help</p></div>
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-xs"><FaStar className="text-yellow-300 mr-2" /><p className="mr-2">5 / 6 phones</p> <RiExpandUpDownLine /></div>
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-s"><TbDeviceDesktopDown /></div>
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-s"><IoMdNotificationsOff /></div>
        <div className="flex items-center m-2 border p-1 border-gray-200 rounded text-xs"><BsStars className="text-yellow-400"/><IoIosList /></div>
      </div>
    </div>
  );
};

export default Top;
