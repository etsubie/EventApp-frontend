import { Button, TextInput, Textarea } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import { useToast } from "../Context/TostContext";
import { fetchEventapi, updateEventsapi, createEventapi } from "../api/events";
import { CategoryDropdown } from "../components/events/CategoreyDropdown";
import "react-datetime-picker/dist/DateTimePicker.css";
import "../style/custom-datetime-picker.css";
import FileBase from 'react-file-base64';
import { AuthContext } from "../Context/AuthContext";
import { imageUrl } from "../api/image";

export function EventForm() {
  const addToast = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    ticket_price: "",
    start_date: new Date(),
    end_date: new Date(),
    capacity: "",
    category_id: null,
    image: "",  // This holds the Base64 string
    imagePreviewUrl: "", // This holds the image preview URL
  });

  useEffect(() => {
    const getEvent = async () => {
      if (id) {
        try {
          const eventData = await fetchEventapi(id);
          setFormData({
            title: eventData.title,
            capacity: eventData.capacity,
            description: eventData.description,
            location: eventData.location,
            ticket_price: eventData.ticket_price,
            start_date: new Date(eventData.start_date),
            end_date: new Date(eventData.end_date),
            category_id: eventData.category_id,
            imagePreviewUrl: eventData.image ? `${imageUrl}/${eventData.image}` : "",
          });
        } catch (error) {
          console.error("Error fetching event:", error);
          setErrorMessage("Error fetching event data.");
        }
      }
    };

    getEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.start_date > formData.end_date) {
      addToast("Start date and time cannot be after end date and time", "error");
      return;
    }

    try {
      const formattedData = {
        ...formData,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
      };
      if (id) {
        await updateEventsapi(id, formattedData);

        if (user?.role === "host") {
          navigate("/host/events");
        } else if (user?.role === "admin") {
          navigate("/admin/events");
        }

        addToast("Event updated successfully!", "success");
      } else {
        await createEventapi(formattedData);
        addToast("Event created successfully!", "success");
        navigate("/host/events");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Creating/updating event failed: " + error.message);
    }
  };

  // Function to handle image preview and Base64 conversion
  const handleImageUpload = (file) => {
    setFormData({
      ...formData,
      image: file.base64,  // Base64 string for the image
      imagePreviewUrl: file.base64  // Preview the image
    });
  };

  return (
    <div className="flex flex-wrap h-full justify-center items-center w-full bg-white p-6">
      <form className="w-full flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold text-center">
          {id ? "Update Event" : "Create Event"}
        </h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          shadow
        />

        <CategoryDropdown
          onCategorySelect={(categoryId) =>
            setFormData({ ...formData, category_id: categoryId })
          }
          initialCategoryId={formData.category_id} // Pass the selected category ID
        />

        <Textarea
          rows="10"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <TextInput
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Location"
          required
          shadow
        />

        <TextInput
          type="number"
          value={formData.ticket_price}
          onChange={(e) =>
            setFormData({ ...formData, ticket_price: e.target.value })
          }
          placeholder="Price"
          shadow
        />

        <TextInput
          type="number"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: e.target.value })
          }
          placeholder="Capacity"
          shadow
        />

        <label>Start Date and Time</label>
        <DateTimePicker
          onChange={(value) => setFormData({ ...formData, start_date: value })}
          value={formData.start_date}
          format="y-MM-dd h:mm a"
          disableClock={false}
          className="w-full bg-white"
        />

        <label>End Date and Time</label>
        <DateTimePicker
          onChange={(value) => setFormData({ ...formData, end_date: value })}
          value={formData.end_date}
          format="y-MM-dd h:mm a"
          disableClock={false}
          className="w-full bg-white"
        />

        {/* Image Preview */}
        {formData.imagePreviewUrl && (
          <div className="mt-4">
            <label>Image Preview:</label>
            <img
              src={formData.imagePreviewUrl}
              alt="Selected"
              className="w-32 h-32 object-cover mt-2"
            />
          </div>
        )}

        {/* FileBase for Image Upload */}
        <FileBase
          type="file"
          multiple={false}
          onDone={handleImageUpload}
        />

        <div className="flex space-x-4 mb-10">
          <Button className="bg-blue-950 w-full" type="submit">
            {loading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update"
              : "Create"}
          </Button>
          <Button className="bg-red-900 w-full" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
