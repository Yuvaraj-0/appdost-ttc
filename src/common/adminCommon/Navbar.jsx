import React from 'react'
import { UserAuth } from '../../context/AuthContext';
const Navbar = () => {

  const { signOut } = UserAuth();


  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };
  return (
    <div className='bg-gray-100 flex items-center justify-between px-10  w-full h-20   '>
        <div class="text-xl font-bold flex item-center justify-center">
    MyLogo
  </div>
        <ul className='flex  justify-center items-center gap-10'>
            
        </ul>
        <div>
        <button onClick={handleLogout}  className="block p-4 ">Logout</button>
        </div>
    </div>
  )
}

export default Navbar