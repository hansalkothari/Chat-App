import Image from "next/image";
import Top from "./components/Top";
import Sidebar from "./components/Sidebar";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div className="home">
      <Sidebar />
      
      <div className="main">
        <Top />

        <div>
          <div className="contacts">
            <Contact name='Hansal' contactNumber="+91 2233445566" />
            <Contact name='Hansal' contactNumber="+91 2233445566"/>
            <Contact name='Hansal' contactNumber="+91 2233445566"/>
            <Contact name='Hansal' contactNumber="+91 2233445566"/>
            <Contact name='Hansal'contactNumber="+91 2233445566"/>
            <Contact name='Hansal' contactNumber="+91 2233445566"/>
            <Contact name='Hansal' contactNumber="+91 2233445566"/>
          </div>
          <div>Chats</div>
        </div>
      
      </div>
    
    </div>
  );
}
