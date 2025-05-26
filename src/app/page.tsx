import Top from "./components/Top";
import Sidebar from "./components/Sidebar";
import Contact from "./components/Contact";
import Chat from "./components/Chat";
import { TbMessageCirclePlus } from "react-icons/tb";
export default function Home() {
  return (
    <div className="flex sticky top-0 left-0 right-0 bottom-0">
      <Sidebar />
      <div className="flex flex-col w-full flex-1">
        <Top />

        <div className="flex flex-1">
          <div className="w-fit relative ">
            <div style={{ maxHeight: 'calc(100vh - 40px)' }} className="flex flex-col w-fit border-r-1 border-gray-200 overflow-y-auto h-full">
              <Contact name='Hansal' contactNumber="+91 2233445566" />
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal'contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566" />
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal'contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
              <Contact name='Hansal' contactNumber="+91 2233445566"/>
            </div>
            <div className='absolute right-3 bottom-3 p-3 bg-green-600 w-fit rounded-4xl'>
                <TbMessageCirclePlus className="text-[1.2rem] text-white"/>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <Chat />
          </div>
        </div>      
      </div>    
    </div>
  );
}
