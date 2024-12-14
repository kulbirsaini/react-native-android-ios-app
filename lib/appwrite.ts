import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email: string, password: string, username: string) => {
  const newAccount = await account.create(ID.unique(), email, password, username);
  if (!newAccount) {
    throw new Error("Failed to create new account.");
  }

  const avatarUrl = avatars.getInitials(username);
  await signIn(email, password);

  await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
    accountId: newAccount.$id,
    email,
    username,
    avatar: avatarUrl,
  });

  return await getCurrentUser();
};

export const signIn = async (email: string, password: string) => {
  try {
    return await getCurrentUser();
  } catch (error) {
    await account.createEmailPasswordSession(email, password);
    return await getCurrentUser();
  }
};

export const signOut = async () => {
  return await account.deleteSession("current");
};

export const getCurrentUser = async () => {
  const currentAccount = await account.get();
  if (!currentAccount) {
    throw new Error("Account does not exist");
  }

  const currentUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [
    Query.equal("accountId", currentAccount.$id),
  ]);
  if (!currentUser) {
    throw new Error("Could not find user");
  }

  return currentUser.documents[0];
};

export const getAllPosts = async () => {
  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId);
  return posts.documents;
};

export const getLatestPosts = async () => {
  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [
    Query.orderDesc("$createdAt"),
    Query.limit(5),
  ]);
  return posts.documents;
};

export const searchPosts = async (query: string) => {
  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [
    Query.search("title", query),
  ]);

  return posts.documents;
};

export const savePost = async (user, postId: string) => {
  if (!user || !user.$id || !postId) {
    return;
  }

  // If the video is already saved for this user
  if (user.savedVideos && user.savedVideos.includes(postId)) {
    return;
  }

  const savedVideos = [...user.savedVideos, postId.toString()];
  return await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, user.$id, { savedVideos });
};

export const unsavePost = async (user, postId: string) => {
  if (!user || !user.$id || !postId) {
    return;
  }

  // If the video is already saved for this user
  if (user.savedVideos && !user.savedVideos.includes(postId)) {
    return;
  }

  const postIdStr = postId.toString();
  const savedVideos = user.savedVideos.filter((v) => v !== postIdStr);
  return await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, user.$id, { savedVideos });
};

export const searchSavedPosts = async (savedVideoIds: string[], query: string) => {
  if (!savedVideoIds || savedVideoIds.length === 0) {
    return [];
  }

  const queries = [Query.contains("$id", savedVideoIds)];
  if (query) {
    queries.push(Query.search("title", query));
  }

  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, queries);

  return posts.documents;
};

export const getUserPosts = async (userId: string) => {
  if (!userId) {
    return [];
  }

  const posts = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, [
    Query.equal("creator", userId),
    Query.orderDesc("$createdAt"),
  ]);
  return posts.documents;
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  if (type === "video") {
    fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
  } else if (type === "image") {
    fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, "top", 100);
  } else {
    throw new Error(`Invalid file type ${type}`);
  }

  if (!fileUrl) {
    throw new Error(`Could not get file url for ${fileId} ${type}`);
  }

  return fileUrl;
};

const uploadFile = async (file, type) => {
  if (!file || !type) {
    return;
  }

  const asset = { ...file, type: file.mimeType };

  const result = await storage.createFile(appwriteConfig.storageId, ID.unique(), asset);
  return getFilePreview(result.$id, type);
};

export const createPost = async ({ title, prompt, video, thumbnail, userId }) => {
  const [videoUrl, thumbnailUrl] = await Promise.all([uploadFile(video, "video"), uploadFile(thumbnail, "image")]);

  const result = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
    title,
    prompt,
    video: videoUrl,
    thumbnail: thumbnailUrl,
    creator: userId,
  });
};

const videos = [
  {
    title: "Get inspired to code",
    thumbnail: "https://i.ibb.co/tJBcX20/Appwrite-video.png",
    video: "https://player.vimeo.com/video/949579770?h=897cd5e781",
    prompt: "Create a motivating AI driven video aimed at inspiring coding enthusiasts with simple language",
  },
  {
    title: "How AI Shapes Coding Future",
    thumbnail: "https://i.ibb.co/Xkgk7DY/Video.png",
    video: "https://player.vimeo.com/video/949581999?h=4672125b31",
    prompt: "Picture the future of coding with AI. Show AR VR",
  },
  {
    title: "Dalmatian's journey through Italy",
    thumbnail: "https://i.ibb.co/CBYzyKh/Video-1.png",
    video: "https://player.vimeo.com/video/949582778?h=d60220d68d",
    prompt: "Create a heartwarming video following the travels of dalmatian dog exploring beautiful Italy",
  },
  {
    title: "Meet small AI friends",
    thumbnail: "https://i.ibb.co/7XqVPVT/Photo-1677756119517.png",
    video: "https://player.vimeo.com/video/949616422?h=d60220d68d",
    prompt: "Make a video about a small blue AI robot blinking its eyes and looking at the screen",
  },
  {
    title: "Find inspiration in Every Line",
    thumbnail: "https://i.ibb.co/mGfCYJY/Video-2.png",
    video: "https://player.vimeo.com/video/949617485?h=d60220d68d",
    prompt:
      "A buy working on his laptop that sparks excitement for coding, emphasizing the endless possibilities and personal growth it offers",
  },
  {
    title: "Japan's Blossoming temple",
    thumbnail: "https://i.ibb.co/3Y2Nk7q/Bucket-215.png",
    video: "https://player.vimeo.com/video/949618057?h=d60220d68d",
    prompt: "Create a captivating video journey through Japan's Sakura Temple",
  },
  {
    title: "A Glimpse into Tomorrow's VR World",
    thumbnail: "https://i.ibb.co/C5wXXf9/Video-3.png",
    video: "https://player.vimeo.com/video/949620017?h=d60220d68d",
    prompt: "An imaginative video envisioning the future of Virtual Reality",
  },
  {
    title: "A World where Ideas Grow Big",
    thumbnail: "https://i.ibb.co/DzXRfyr/Bucket-59038.png",
    video: "https://player.vimeo.com/video/949620200?h=d60220d68d",
    prompt: "Make a fun video about hackers and all the cool stuff they do with computers",
  },
];

export const populateVideos = async () => {
  console.log("getting user");
  const user = await getCurrentUser();

  try {
    videos.map(async (video) => {
      console.log("adding video", video);
      const result = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
        ...video,
        creator: user.$id,
      });
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
};
