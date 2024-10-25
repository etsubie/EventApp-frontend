import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { deleteUserapi } from "../../api/users";
import { useToast } from "../../Context/TostContext";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Modal, Button } from "flowbite-react"; 
import { useNavigate } from "react-router-dom";

const DangerZone = () => {
  const addToast = useToast();
  const [showModal, setShowModal] = useState(false); 
  const {  user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    try {
      await deleteUserapi(userId);
      addToast("Account deleted successfully!", "success");
      setShowModal(false); 
	  localStorage.removeItem("token"); // Clear the token
	  setToken(null); // Clear the token in context
	  setUser(null);
      navigate("/"); 
    } catch (error) {
      addToast("Failed to delete account. Please try again.", "error");
    }
  };

  return (
    <>
      <motion.div
        className="bg-red-600 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center mb-4">
          <Trash2 className="text-red-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-100">Danger Zone</h2>
        </div>
        <p className="text-gray-100 mb-4">
          Permanently delete your account and all of your content.
        </p>
        <button
          className="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => setShowModal(true)} 
        >
          Delete Account
        </button>
      </motion.div>

      {/* Flowbite Confirmation Modal */}
      <Modal show={showModal} size="md" popup={true} onClose={() => setShowModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <Trash2 className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete your account? This action cannot be undone.
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="text-blue-800" onClick={() => handleDelete(user.id)}>
                Yes, I'm sure
              </Button>
              <Button className="text-red-800" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DangerZone;
