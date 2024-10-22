import { Button } from 'flowbite-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import upload from '../../images/upload.jpg';

export function FileUploder({ imgUrl, onFieldChange }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]; // Get the first file
    const url = URL.createObjectURL(file); // Create a temporary URL for the file preview
    onFieldChange({
      url: url, // Update the imgUrl with a temporary URL for preview
      file: file, // Send the actual file to the parent
    });
  }, [onFieldChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [], // Accept all image types
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-3"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {imgUrl ? (
        <div className="flex h-full w-full flex-1 justify-center">
          <img
            src={imgUrl}
            alt="Uploaded"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col py-5 text-grey-500">
          <img src={upload} width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button className="rounded-full bg-gray-900">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
