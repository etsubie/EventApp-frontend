import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUsers, deleteUserapi } from "../../api/users";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../Context/TostContext";
import { Modal, Button } from "flowbite-react";
import { Loader, Trash2 } from "lucide-react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); // Store the user to delete
  const addToast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers();
        if (Array.isArray(data)) {
          setUsers(data);
          setOriginalUsers(data);
        } else {
          throw new Error("Unexpected data format from server.");
        }
      } catch (error) {
        addToast("Failed to fetch users. Please try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    getUsers(); // Fetch users on component mount
  }, [addToast]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = originalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setUsers(filtered);
  };

  const handleDelete = async () => {
    try {
      await deleteUserapi(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setShowModal(false);
      addToast("User deleted successfully!", "success");
    } catch (error) {
      addToast("Failed to delete user. Please try again.", "error");
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user); // Set the user to delete
    setShowModal(true); // Open modal
  };

  if (loading) {
    return <div><Loader/></div>;
  }

  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-400 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="placeholder-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y  divide-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.length > 0 ? (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user.role ? user.role : "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Flowbite Confirmation Modal */}
      {selectedUser && (
        <Modal
          show={showModal}
          size="md"
          popup={true}
          onClose={() => setShowModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                <h3 className="mb-5 text-lg font-normal text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="text-blue-700">{selectedUser.name}</span>?
                  This action cannot be undone.
                </h3>
              </h3>
              <div className="flex justify-center gap-4">
                <Button className="text-blue-800" onClick={handleDelete}>
                  Yes, I'm sure
                </Button>
                <Button
                  className="text-red-800"
                  onClick={() => setShowModal(false)}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </motion.div>
  );
};

export default UsersTable;
