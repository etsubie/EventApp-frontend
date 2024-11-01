import React, { useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import { createCategoryApi, fetchCategoriesApi } from "../../api/categories";

export function CategoryDropdown({ onCategorySelect, initialCategoryId }) {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCategoriesApi();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const response = await createCategoryApi(newCategory);
      const createdCategory = response.category;

      if (createdCategory && createdCategory.id && createdCategory.name) {
        const newCategoryObj = { id: createdCategory.id, name: createdCategory.name };
        setCategories((prevCategories) => [...prevCategories, newCategoryObj]);
        setSelectedCategory(newCategoryObj.id);
        onCategorySelect(newCategoryObj.id);
        setNewCategory(""); // Clear the input after creation
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  useEffect(() => {
    // Set initial category when editing
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  return (
    <div>
      <select
        className="w-full rounded border-gray-300"
        onChange={(e) => {
          const selectedValue = e.target.value;
          setSelectedCategory(selectedValue);
          if (selectedValue === "create-new") {
            setModalOpen(true);
          } else {
            onCategorySelect(selectedValue);
          }
        }}
        value={selectedCategory || ""}
      >
        <option value="" disabled hidden className="text-gray-100 text-sm">
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name || "Unnamed Category"}
          </option>
        ))}
        <option key="create-new-option" value="create-new" className="text-blue-600">
          Create New Category
        </option>
      </select>

      <Modal show={isModalOpen} onClose={() => setModalOpen(false)} className="p-20 bg-blue-800">
        <Modal.Header>Create New Category</Modal.Header>
        <Modal.Body>
          <TextInput
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateCategory} className="text-green-600">Create</Button>
          <Button onClick={() => setModalOpen(false)} className="text-red-600">Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
