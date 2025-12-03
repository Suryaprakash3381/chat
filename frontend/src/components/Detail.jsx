import { useEffect, useState } from "react";
import axios from "axios";
import Default from "../assets/Default.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AccordionDemo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:7000/api/user/dashboard", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log("User Fetch Error:", err));
  }, []);


  const HandleLogout = () => {
    console.log("Logging out...");
    axios.post("http://localhost:7000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/login";
      })
      .catch((err) => console.log("Logout Error:", err));         
    }

  return (

    

    <Accordion type="single" collapsible className="w-[90%] max-w-3xl mx-auto  text-black" defaultValue="item-2">
      
      <AccordionItem value="item-2">
        <AccordionTrigger className="flex items-center gap-2 py-4">
          <img
            src={user?.profilePic || Default}
            alt="profile"
            className="h-20 w-20 rounded-full object-cover"
          />
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-1 text-lg ">
          <p className="text-lg font-bold ml-4">{user?.username || "User"}</p>
          <p className="text-sm opacity-70 ml-4">{user?.email || ""}</p>
          
          <p className="font-semibold ml-4">Bio</p>
          <p className="opacity-80 ml-4">{user?.bio || "No bio added yet."}</p>

          <div className="button flex flex-col sm:flex-row mt-4 justify-between">
            <button
            className="self-start px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors w-20 ml-2"
          >
            edit
          </button>
          <button
            onClick={HandleLogout}
            className="self-start px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-800 transition-colors  ml-2"
          >
             Logout
          </button>
          
          </div>
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  );
}

