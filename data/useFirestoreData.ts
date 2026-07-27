// hooks/useFirestoreData.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // your Firestore instance

export function useFirestoreData(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, collectionName));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    }

    fetchData();
  }, [collectionName]);

  return { data, loading };
}
