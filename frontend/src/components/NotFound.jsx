  //   if (type === "file") {
  //     const file = files[0]; // Get the first selected file

  //     // Set the selected file in the formData
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       profilePicture: file,
  //     }));

  //     // Generate a URL for the file and set the preview image URL
  //     if (file) {
  //       const fileURL = URL.createObjectURL(file); // Create a URL for the file
  //       setProfilePicPreview(fileURL); // Store the file's preview URL
  //     }
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }