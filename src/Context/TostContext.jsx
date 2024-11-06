import React, { createContext, useContext, useState } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    // default type success
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-500",
          icon: <HiCheck className="h-5 w-5" />,
        };
      case "error":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-500",
          icon: <HiX className="h-5 w-5" />,
        };
      case "warning":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-500",
          icon: <HiExclamation className="h-5 w-5" />,
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
          icon: null,
        };
    }
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-4">
        {toasts.map((toast) => {
          const { bgColor, textColor, icon } = getToastStyles(toast.type);

          return (
            <Toast key={toast.id} className={`${bgColor} ${textColor}`}>
              <div className="inline-flex items-center">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  {icon}
                </div>
                <div className="ml-3 text-sm font-normal">{toast.message}</div>
                <Toast.Toggle />
              </div>
            </Toast>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
