import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";

const useFirebaseCollection = (collectionName) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
      } catch (error) {
        console.error(`Error fetching data from ${collectionName}:`, error);
      }
    };

    fetchData();
  }, [collectionName]);

  return data;
};

export default useFirebaseCollection;