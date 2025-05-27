'use client';
import Top from "./components/Top";
import Sidebar from "./components/Sidebar";
import Contact from "./components/Contact";
import Chat from "./components/Chat";
import { TbMessageCirclePlus } from "react-icons/tb";
import { useEffect , useState} from "react";
import { supabase } from './lib/supabase-client'

interface Profile {
  id: string;
  email: string;
  username: string;
  created_at: string;
  last_seen?: string | undefined | null;
}

interface ContactRow {
  contact_id: string;
}

export default function Home() {

  const [contacts, setContacts] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selected, setSelected] = useState<Profile | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(()=>{
    async function fetchContacts() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log('Current user UUID:', user.id);

        // Fetch contact IDs
        const { data: contactRows, error: contactError } = await supabase
          .from('contacts')
          .select('contact_id')
          .eq('user_id', user.id);

        if (contactError) {
          console.error('Error fetching contacts:', contactError.message);
          setLoading(false);
          return;
        }

        const contactIds = (contactRows as ContactRow[]).map(row => row.contact_id);

        if (contactIds.length === 0) {
          console.log('No contacts found for this user.');
          setContacts([]);
          setLoading(false);
          return;
        }

        // Fetch profile details for contact IDs
        const { data: profiles, error: profileError } = await supabase
          .from('Profile')
          .select('*')
          .in('id', contactIds);

        if (profileError) {
          console.error('Error fetching contact profiles:', profileError.message);
          setLoading(false);
          return;
        }

        console.log('Fetched contact profiles:', profiles);
        setContacts(profiles as Profile[]);
      } else {
        console.log('No user is logged in.');
        setContacts([]);
      }

      setLoading(false);
    }

    fetchContacts();
  },[])

  useEffect(()=>{
    if (!selected){
      setConversationId(null);
      console.log("the selected contact is: ",selected);
      return;
    }

    (async () => {
      // 1️⃣ get current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('auth.getUser error', userError);
        return;
      }
      const uid = user.id;
      const other = selected.id;
  
      // 2️⃣ try to find an existing conversation
      const { data: existingConvos, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(user1_id.eq.${uid},user2_id.eq.${other}),and(user1_id.eq.${other},user2_id.eq.${uid})`
        )
        .limit(1);
  
      if (fetchError) {
        console.error('Error fetching conversation:', fetchError);
        return;
      }
  
      if (existingConvos && existingConvos.length > 0) {
        // found it!
        setConversationId(existingConvos[0].id);
      } else {
        // 3️⃣ otherwise create a new one
        const { data: inserted, error: insertError } = await supabase
          .from('conversations')
          .insert({ user1_id: uid, user2_id: other })
          .select('id')
          .limit(1);
  
        if (insertError) {
          console.error('Error creating conversation:', insertError);
        } else {
          setConversationId(inserted![0].id);
        }
      }
    })();

  },[selected])

  return (
    <div className="flex sticky top-0 left-0 right-0 bottom-0">
      <Sidebar />
      <div className="flex flex-col w-full flex-1">
        <Top />
        <div className="flex flex-1">
          <div className="w-fit relative ">
            
            <div style={{ maxHeight: 'calc(100vh - 40px)' }} className="flex flex-col w-fit border-r-1 border-gray-200 overflow-y-auto h-full">
              {loading ? (
                <div className="flex justify-center items-center w-full h-full p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
                </div>
              ) : contacts.length > 0 ? (
                contacts.map(c => (
                  <div key={c.id} onClick={() => setSelected(c)}>
                    <Contact
                      id={c.id}
                      name={c.username}
                      contactNumber={c.email}
                      isActive={c.id === selected?.id}
                    />
                </div>
                ))
              ) : (
                <p>No contacts found.</p>
              )}
            </div>
            
            <div className='absolute right-3 bottom-3 p-3 bg-green-600 w-fit rounded-4xl'>
                <TbMessageCirclePlus className="text-[1.2rem] text-white"/>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selected && conversationId ? (
              <Chat
                conversationId={conversationId}
                contact={{ id: selected!.id, username: selected!.username, last_seen: selected!.last_seen }}
              />
            ) : (
              <div
                className="
                  flex-1
                  bg-[url('/doodle2-3.jpg')] bg-repeat
                  flex items-center justify-center
                "
              >
                <p className="text-gray-500 text-lg italic">
                  Select a contact to start chatting
                </p>
              </div>
            )}
        </div>
        </div>      
      </div>    
    </div>
  );
}
