"use client";
import Top from "./components/Top";
import Sidebar from "./components/Sidebar";
import Contact from "./components/Contact";
import Chat from "./components/Chat";
import { TbMessageCirclePlus } from "react-icons/tb";
import { HiFolderDownload } from "react-icons/hi";
import { RiFilter3Fill } from "react-icons/ri";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase-client";
import { useRouter } from 'next/navigation';


interface Profile {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  created_at: string;
  last_seen?: string | undefined | null;
  lastMessage?: string;
}

interface ContactRow {
  contact_id: string;
}
export default function Home() {
  const [contacts, setContacts] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    async function fetchContacts() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        setLoading(false);
        router.push("/register"); 
        return;
      }

      if (user) {
        console.log("Current user UUID:", user.id);

        // 1️⃣ Fetch contact IDs
        const { data: contactRows, error: contactError } = await supabase
          .from("contacts")
          .select("contact_id")
          .eq("user_id", user.id);

        if (contactError) {
          console.error("Error fetching contacts:", contactError.message);
          setLoading(false);
          return;
        }

        const contactIds = (contactRows as ContactRow[]).map(
          (row) => row.contact_id
        );

        if (contactIds.length === 0) {
          console.log("No contacts found for this user.");
          setContacts([]);
          setLoading(false);
          return;
        }

        // 2️⃣ Fetch profile details for contact IDs
        const { data: profiles, error: profileError } = await supabase
          .from("Profile")
          .select("*")
          .in("id", contactIds);

        if (profileError) {
          console.error(
            "Error fetching contact profiles:",
            profileError.message
          );
          setLoading(false);
          return;
        }

        // 3️⃣ For each contact, fetch the last message (latest by timestamp)
        const enrichedContacts = await Promise.all(
          (profiles as Profile[]).map(async (profile) => {
            // 1️⃣ Get conversation_id between current user and profile
            const { data: conversation, error: conversationError } =
              await supabase
                .from("conversations")
                .select("id")
                .or(
                  `and(user1_id.eq.${user.id},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${user.id})`
                )
                .limit(1)
                .single();

            if (conversationError || !conversation) {
              console.warn(`No conversation found for contact ${profile.id}`);
              return { ...profile, lastMessage: "No conversation yet." };
            }

            const conversationId = conversation.id;

            // 2️⃣ Fetch last message from messages table by conversation_id
            const { data: messages, error: messageError } = await supabase
              .from("messages")
              .select("content, sender_id, created_at")
              .eq("conversation_id", conversationId)
              .order("created_at", { ascending: false })
              .limit(1);

            if (messageError) {
              console.error(`Error fetching messages for contact ${profile.id}:`, messageError);
            }
            const lastMessage = messages?.[0]?.content || "No message yet.";
            return { ...profile, lastMessage };
          })
        );

        console.log("Fetched contact profiles:", profiles);

        setContacts(enrichedContacts);
        // setContacts(profiles as Profile[]);
      } else {
        console.log("No user is logged in.");
        setContacts([]);
      }

      setLoading(false);
    }
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!selected) {
      setConversationId(null);
      console.log("the selected contact is: ", selected);
      return;
    }

    (async () => {
      // 1️⃣ get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("auth.getUser error", userError);
        return;
      }
      const uid = user.id;
      const other = selected.id;

      // 2️⃣ try to find an existing conversation
      const { data: existingConvos, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(user1_id.eq.${uid},user2_id.eq.${other}),and(user1_id.eq.${other},user2_id.eq.${uid})`
        )
        .limit(1);

      if (fetchError) {
        console.error("Error fetching conversation:", fetchError);
        return;
      }

      if (existingConvos && existingConvos.length > 0) {
        // found it!
        setConversationId(existingConvos[0].id);
      } else {
        // 3️⃣ otherwise create a new one
        const { data: inserted, error: insertError } = await supabase
          .from("conversations")
          .insert({ user1_id: uid, user2_id: other })
          .select("id")
          .limit(1);

        if (insertError) {
          console.error("Error creating conversation:", insertError);
        } else {
          setConversationId(inserted![0].id);
        }
      }
    })();
  }, [selected]);

  async function handleAddContact() {
    const email = prompt("Enter the email of the contact you want to add:");
    if (!email) return;

    try {
      // 1️⃣ Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching current user:", userError);
        alert("You must be logged in to add a contact.");
        return;
      }

      // 2️⃣ Check if the user with the provided email exists
      const { data: profiles, error: profileError } = await supabase
        .from("Profile")
        .select("id, email, username, phone_number, created_at, last_seen")
        .eq("email", email)
        .limit(1);

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        alert("Error fetching contact profile.");
        return;
      }

      if (!profiles || profiles.length === 0) {
        alert("No user found with this email.");
        return;
      }

      const contactProfile = profiles[0];

      // 3️⃣ Insert the contact into the 'contacts' table
      const { error: insertError } = await supabase
        .from("contacts")
        .insert({ user_id: user.id, contact_id: contactProfile.id });

      if (insertError) {
        console.error("Error adding contact:", insertError);
        alert("Failed to add contact.");
        return;
      }

      // 4️⃣ Update the contacts list in state
      setContacts((prev) => [...prev, contactProfile]);
      alert(`Successfully added ${contactProfile.username} as a contact!`);
    } catch (err) {
      console.error("Unexpected error adding contact:", err);
      alert("Something went wrong.");
    }
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone_number.includes(searchTerm)
  );

  return (
    <main className="flex sticky top-0 left-0 right-0 bottom-0">
      <Sidebar />
      <section className="flex flex-col w-full flex-1">
        <Top />

        <div className="flex flex-1">
          <section className="w-fit relative ">
            <div
              style={{ maxHeight: "calc(100vh - 40px)" }}
              className="flex flex-col w-fit min-w-[400px] border-r-1 border-gray-200 overflow-y-auto h-full"
            >
              <div className="filters flex items-center h-14 bg-gray-100 border-b-1 border-gray-200">
                <HiFolderDownload className="text-green-700 text-[1.1rem] ml-2" />
                <p className="text-green-700 font-bold text-[0.9rem] m-2">
                  Custom Filter
                </p>
                <div className="flex items-center flex-1 bg-white pl-2 pr-2 border-1 border-gray-200 rounded-sm ">
                  <HiMiniMagnifyingGlass className="font-black" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm p-1 focus:outline-none font-bold flex-1 min-w-0 overflow-x-auto whitespace-nowrap"
                  />
                </div>
                <div className="flex items-center pl-2 pr-2 bg-white border-1 border-gray-200 rounded-sm">
                  <RiFilter3Fill className="text-sm text-green-700 font-bold mr-1" />
                  <p className="text-sm p-1 text-green-700 font-bold">
                    Filtered
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center w-full h-full p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
                </div>
              ) : searchTerm !== "" ? (
                filteredContacts.length > 0 ? (
                  filteredContacts.map((c) => (
                    <div key={c.id} onClick={() => setSelected(c)}>
                      <Contact
                        id={c.id}
                        name={c.username}
                        contactNumber={c.phone_number}
                        lastMessage={c.lastMessage}
                        isActive={c.id === selected?.id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center w-full h-full p-10">
                    <p className="text-gray-500 text-lg italic">
                      No matching contacts found.
                    </p>
                  </div>
                )
              ) : contacts.length > 0 && searchTerm === "" ? (
                contacts.map((c) => (
                  <div key={c.id} onClick={() => setSelected(c)}>
                    <Contact
                      id={c.id}
                      name={c.username}
                      contactNumber={c.phone_number}
                      lastMessage={c.lastMessage}
                      isActive={c.id === selected?.id}
                    />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full h-full p-10">
                  <p className="text-gray-500 text-lg italic">
                    No contacts found.
                  </p>
                </div>
              )}
            </div>

            <div
              onClick={handleAddContact}
              className="absolute right-3 bottom-3 p-3 bg-green-600 w-fit rounded-4xl cursor-pointer"
            >
              <TbMessageCirclePlus className="text-[1.2rem] text-white" />
            </div>
          </section>

          <section className="flex-1 flex flex-col">
            {selected && conversationId ? (
              <Chat
                conversationId={conversationId}
                contact={{
                  id: selected!.id,
                  username: selected!.username,
                  last_seen: selected!.last_seen,
                }}
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
          </section>
        </div>
      </section>
    </main>
  );
}
