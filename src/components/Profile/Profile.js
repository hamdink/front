import React, { useState, useEffect } from 'react';
import { getById as getAdminById, updateAdmin } from '../../api/adminService';
import { fetchMarketById, modifyMagasin } from '../../api/marketService';
import { FaUserCircle } from 'react-icons/fa';
import Dashboard from '../dashboard/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    image: '',
  });
  const [password, setPassword] = useState('');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let data;
        if (role === 'admin') {
          data = await getAdminById(userId);
        } else if (role === 'market') {
          data = await fetchMarketById(userId);
        }

        if (data) {
          setUserData({
            name: data.name || `${data.first_name} ${data.last_name}`,
            email: data.email,
            image: data.image ? `data:image/jpeg;base64,${data.image}` : '',
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [role, userId]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      const updateData = { image: base64String };

      try {
        if (role === 'admin') {
          await updateAdmin(userId, updateData);
        } else if (role === 'market') {
          await modifyMagasin(userId, updateData);
        }

        localStorage.removeItem('profileImage');

        localStorage.setItem('profileImage', reader.result);

        setUserData((prev) => ({ ...prev, image: reader.result }));

        toast.success('Avatar updated successfully');
      } catch (error) {
        console.error('Error updating avatar:', error);
        toast.error('Failed to update avatar');
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    const updateData = { image: '' };

    try {
      if (role === 'admin') {
        await updateAdmin(userId, updateData);
      } else if (role === 'market') {
        await modifyMagasin(userId, updateData);
      }

      localStorage.removeItem('profileImage');

      setUserData((prev) => ({ ...prev, image: '' }));

      toast.success('Avatar removed successfully');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove avatar');
    }
  };

  const handlePasswordChange = async () => {
    if (!password) {
      toast.error('Please enter a new password');
      return;
    }

    const updateData = { password }; // Plain text password, backend should handle hashing

    try {
      if (role === 'admin') {
        await updateAdmin(userId, updateData);
      } else if (role === 'market') {
        await modifyMagasin(userId, updateData);
      }
      toast.success('Password updated successfully');
      setPassword(''); // Clear the password field
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-white-100">
      <Dashboard title="Profile" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <ToastContainer />
          <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-600">User Details</h3>
                <div className="mt-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-600">Change Password</h3>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  onClick={handlePasswordChange}
                  className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Change Password
                </button>
              </div>
            </div>
            <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600">Profile Avatar</h3>
              <div className="mt-4 flex items-center">
                {userData.image ? (
                  <img src={userData.image} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="text-gray-500 text-6xl" />
                )}
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  className="ml-4 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              {userData.image && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleRemoveAvatar}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    Remove Current Avatar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
