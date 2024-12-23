const MAX_VIDEO_DURATION = 61000;
const MAX_VIDEO_SIZE = 25.1 * 1024 * 1024;
const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
const VIDEO_ERRORS = {
  MISSING_FILE: "Please select a video file.",
  INVALID_FILE_TYPE: "Please select a valid video file.",
  VIDEO_TOO_LONG: "Video must not exceed 60 seconds in size.",
  VIDEO_TOO_LARGE: "Video must not exceed 10 MB in size.",
};
const IMAGE_ERRORS = {
  MISSING_FILE: "Please select an image.",
  INVALID_FILE_TYPE: "We support images in JPG, JPEG, PNG, GIF, and WebP formats only.",
  IMAGE_TOO_LARGE: "Images must not exceed 1 MB in size.",
};

export const isValidPassword = (password: string) => {
  return password && password.trim().length >= 6;
};

export const isValidEmail = (email: string) => {
  return email && email.trim().includes("@");
};

export const isValidOtp = (otp: string) => {
  return otp && otp.match(/^[0-9]{6}$/);
};

export const validateVideo = (video) => {
  if (!video) {
    return { valid: false, message: VIDEO_ERRORS.MISSING_FILE };
  }

  if (video.type !== "video") {
    return { valid: false, message: VIDEO_ERRORS.INVALID_FILE_TYPE };
  }

  if (video.duration > MAX_VIDEO_DURATION) {
    return { valid: false, message: VIDEO_ERRORS.VIDEO_TOO_LONG };
  }

  if (video.fileSize > MAX_VIDEO_SIZE) {
    return { valid: false, message: VIDEO_ERRORS.VIDEO_TOO_LARGE };
  }

  if (!["video/mp4"].includes(video.mimeType)) {
    return { valid: false, message: VIDEO_ERRORS.INVALID_FILE_TYPE };
  }

  return { valid: true };
};

export const validateImage = (image) => {
  if (!image) {
    return { valid: false, message: IMAGE_ERRORS.MISSING_FILE };
  }

  if (image.type !== "image") {
    return { valid: false, message: IMAGE_ERRORS.INVALID_FILE_TYPE };
  }

  if (image.fileSize > MAX_IMAGE_SIZE) {
    return { valid: false, message: IMAGE_ERRORS.IMAGE_TOO_LARGE };
  }

  if (!["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(image.mimeType)) {
    return { valid: false, message: IMAGE_ERRORS.INVALID_FILE_TYPE };
  }

  return { valid: true };
};
