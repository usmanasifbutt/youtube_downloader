// Regular expression to validate HH:MM:SS format
const TIME_REGEX = /^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/;

export const parseTimeInput = (input) => {  
    // Test the input format
    const match = input.match(TIME_REGEX);
    if (!match) {
      console.log("Invalid time format. Please use HH:MM:SS format.");
      return null;
    }
  
    const [_, hours, minutes, seconds] = match;
  
    // Convert to two-digit format
    const formattedTime = [
      hours.padStart(2, "0"),
      minutes.padStart(2, "0"),
      seconds.padStart(2, "0"),
    ].join(":");
  
    return formattedTime;
};

export const formatTimeInput = (value) => {
  // Remove any non-numeric characters
  value = value.replace(/\D/g, "");

  // Ensure it follows the HH:MM:SS format
  if (value.length > 6) {
    value = value.slice(0, 6); // Limit to 6 characters
  }

  // Insert colons after every two characters
  value = value.replace(/(\d{2})(?=\d)/g, "$1:");

  return value;
};

export const isAbsoluteUrl = (url) => {
  return url.startsWith("http://") || url.startsWith("https://");
}