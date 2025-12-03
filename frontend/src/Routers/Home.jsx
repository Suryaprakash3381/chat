import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Accordion from '../components/Accordian.jsx'
import Contact from '../assets/contact.png'
import { Button } from "@/components/ui/button"

function Home() {
  return (
    <>
       <div className="home w-full h-screen bg-gradient-to-br from-gray-200 to-gray-800 relative">
        <Navbar  className="fixed top-10 left-0 right-0" />

        <div className="content flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide">Connect Faster. Chat Smarter.</h1>
          <p className="text-4xl  font-extrabold mb-8">A seamless and secure messaging experience built for modern conversations.</p>
          <a href="/login"  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 mt-4">Get Started</a>
        </div>

        <div className="pt2 bg-gradient-to-bl from-gray-800 to-gray-200 py-16 flex flex-col justify-center items-center">
          <h1 className='text-3xl font-extrabold mb-6 tracking-wide'>About Us</h1>
          <Accordion />
          <h1 className='text-3xl font-bold mt-9  tracking-wide'>What we provide(Services)</h1>
          <ul className='list-disc list-inside text-left mt-9 max-w-2xl '>
            <li className='mb-2 font-bold '>Real-time Messaging: Instant communication with friends, family, and colleagues.</li>
            <li className='mb-2 font-bold '>Group Chats: Create and manage group conversations for teams or social circles.</li>
            <li className='mb-2 font-bold '>Media Sharing: Easily share photos, videos, and files within your chats.</li>
            <li className='mb-2 font-bold '>End-to-End Encryption: Ensuring your messages are private and secure.</li>
            <li className='mb-2 font-bold '>Cross-Platform Support: Access your messages from any device, anywhere.</li>
          </ul>
        </div>

        <div className="pt3 bg-gradient-to-br from-gray-200 to-gray-800  flex flex-row w-full">
          <div className="w-1/2 flex flex-col  p-8">
             <h1 className='text-2xl font-bold text-gray-700 mt-10 mx-10'>Get In Touch</h1>
              <p className='text-gray-600 mt-4 mx-10'>We would love to hear from you! Whether you have questions, feedback,
                 or need assistance, our team is here to help. Reach out to us through any of the following methods:</p>
                 <form action="">
                  <div className="flex flex-col mt-4 mx-10">
                    <label htmlFor="name" className="mb-2 font-semibold text-gray-700">Name</label>
                    <input type="text" id="name" name="name" placeholder='Enter your name here.' className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex flex-col mt-4 mx-10">
                    <label htmlFor="email" className="mb-2 font-semibold text-gray-700">Email</label>
                    <input type="email" id="email" name="email" placeholder='Enter your e-mail.' className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex flex-col mt-4 mx-10">
                    <label htmlFor="message" className="mb-2 font-semibold text-gray-700">Message</label>
                    <textarea id="message" name="message" rows="4" placeholder='Doo you have any Queries?' className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>

                  <button type="submit" className="mt-4 mx-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">Submit</button>

                  

                 </form>
          </div>

           
          <div className="w-1/2 flex justify-center items-center p-8">
            <img src={Contact} alt="Contact Us" className="max-w-full h-full rounded-lg  object-contain mt-15" />
          </div>
        </div>
        
       </div>
      
    </>
  )
}

export default Home
