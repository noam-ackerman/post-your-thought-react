import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getDatabase,
  ref as databaseRef,
  update,
  onValue,
  remove,
  set,
  get,
  child,
} from "firebase/database";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import type { UserRecord, PostRecord } from "@/types";

const database = getDatabase();
const storage = getStorage();
const defaultAvatarUrl = "https://iili.io/Hrna4x1.png";

type UsersData = Record<string, UserRecord>;

interface UsersContextValue {
  updateUserDatabase: (data: Partial<UserRecord>) => Promise<void>;
  usersData: UsersData | undefined;
  setUsersData: Dispatch<SetStateAction<UsersData | undefined>>;
  deleteUserDatabase: () => Promise<void>;
  postsData: PostRecord[] | undefined;
  updatePost: (postId: string, data: Partial<PostRecord>) => Promise<void>;
  removePost: (postId: string) => Promise<void>;
  currentUserData: UserRecord | undefined;
  uploadImageToStorageAndGetUrl: (imgFile: File) => Promise<string>;
  deleteStorageUser: () => void;
}

const UsersContext = createContext<UsersContextValue>({} as UsersContextValue);

const useUsersCtx = () => {
  return useContext(UsersContext);
};

const UsersContextProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [usersData, setUsersData] = useState<UsersData>();
  const [postsData, setPostsData] = useState<PostRecord[]>();
  const [currentUserData, setCurrentUserData] = useState<UserRecord>();

  // storage

  async function uploadImageToStorageAndGetUrl(imgFile: File) {
    const fileRef = ref(
      storage,
      "images/" + currentUser!.uid + "/" + imgFile.name
    );
    try {
      await uploadBytes(fileRef, imgFile);
      return getDownloadURL(fileRef);
    } catch {
      return Promise.reject();
    }
  }

  function deleteStorageUser() {
    const ImagesRef = ref(storage, "images/" + currentUser!.uid);
    listAll(ImagesRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
      .catch(() => {
        return new Error("failed to delete user storage data!");
      });
  }

  //database

  function updateUserDatabase(data: Partial<UserRecord>) {
    const userRef = databaseRef(database, "users/" + currentUser!.uid);
    return update(userRef, data);
  }

  function deleteUserDatabase() {
    const userRef = databaseRef(database, "users/" + currentUser!.uid);
    return remove(userRef);
  }

  function updatePost(postId: string, data: Partial<PostRecord>) {
    const postRef = databaseRef(database, "posts/" + postId);
    return update(postRef, data);
  }

  function removePost(postId: string) {
    const postRef = databaseRef(database, "posts/" + postId);
    return remove(postRef);
  }

  // fetching users , current user and likes data from database

  useEffect(() => {
    if (currentUser) {
      const userRef = databaseRef(database, "users/" + currentUser.uid);

      //setting current user in database on first signup
      get(child(databaseRef(database), "users/" + currentUser.uid)).then(
        (snapshot) => {
          if (!snapshot.exists()) {
            set(userRef, {
              userId: currentUser.uid,
              displayName: currentUser.email!.split("@")[0],
              email: currentUser.email,
              photoURL: defaultAvatarUrl,
              bio: "",
            });
          }
        }
      );
      // current user data
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setCurrentUserData(data);
        else setCurrentUserData({} as UserRecord);
      });

      // all users data
      const usersRef = databaseRef(database, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setUsersData(data);
        else setUsersData({});
      });

      // all posts data
      const postsRef = databaseRef(database, "posts");
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val() as Record<string, PostRecord> | null;
        if (data) {
          const sortedPosts = Object.values(data).sort(
            (a, b) => b.date - a.date
          );
          setPostsData(sortedPosts);
        } else {
          setPostsData([]);
        }
      });
    } else if (!currentUser) {
      setCurrentUserData(undefined);
      setUsersData(undefined);
      setPostsData(undefined);
    }
  }, [currentUser]);

  const ContextValue: UsersContextValue = {
    updateUserDatabase,
    usersData,
    setUsersData,
    deleteUserDatabase,
    postsData,
    updatePost,
    removePost,
    currentUserData,
    uploadImageToStorageAndGetUrl,
    deleteStorageUser,
  };

  return (
    <UsersContext.Provider value={ContextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersCtx, UsersContextProvider };
