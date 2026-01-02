import { useState } from "react";
import {Link} from "react-router-dom"

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
     

     <div
  className={` relative top-0 left-0  bg-gray-400 text-white
  transition-all duration-300 overflow-hidden
  ${open ? "w-64" : "w-10"}`}
>

   <button
   
   className="p-2 "
 >
   
 </button>

<button
          onClick={() => setOpen(!open)}
          className="text-white  absolute right-5   "
        >
          {open ? "✕" : "☰"}
        </button>
 
  
  {open && (
    <>
      <h2 className="p-4 text-xl font-bold">Menu</h2>
       <Link to="/admindashboard" className="block p-4 hover:bg-gray-700" >Home</Link>
      <Link to="/addproduct" className="block p-4 hover:bg-gray-700" >Addproduct</Link>
      <Link to="/admin/products" className="block p-4 hover:bg-gray-700" >ProductList</Link> 
    </>
  )}
</div>

    </>
  );
}
