import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Setting() {


    const [profilePicPreview, setProfilePicPreview] = useState("");











  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Setting</h2>
{/* change profile picture */}

<div>
    <label>
{profilePicPreview ? (
    <img src="{profilePicPreview}"  alt="Profile Preview" className="w-24 h-24 rounded-full object-cover"/>
) : (
    <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-white text-xl">
        <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
    </div>
)}

<input type="file" className="hidden" onChange={handleFileChange} />


    </label>
</div>

<form onSubmit={handleSubmit}>
{/* change username */}

<div>
<label className="block text-lg font-medium">New Username</label>
    <input type="text" name="username" value={FormData.username} onChange={handleChange}   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
</div>

{/* current password */}
<label className="block text-lg font-medium">Current Password</label>



</form>














      </div>
    </div>
  );
}
