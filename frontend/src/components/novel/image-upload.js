// Simple image upload function that returns a data URL
// In a real application, you would upload to a server and return the URL

export const uploadFn = async (file) => {
  // Simulate a delay like in a real upload
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Create a data URL from the file
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};
