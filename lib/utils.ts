import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { db } from "./firebase";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { ICondition } from "@/data/interfaces/condition.interface";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a generic converter function
export function converter<T extends DocumentData>() {
  return {
    toFirestore: (data: T): DocumentData => {
      return data;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      const data = snapshot.data() as T;
      return data;
    },
  };
}

export const dataPointCollection = <T extends DocumentData>(
  collectionPath: string
) => {
  const collectionRef = collection(
    db,
    collectionPath
  ) as CollectionReference<T>;

  return collectionRef.withConverter(converter<T>());
};

export const dataPointDocument = <T extends DocumentData>(
  documentPath: string,
  ...pathSegments: string[]
) => {
  const fullPath = [documentPath, ...pathSegments].join("/");
  const docRef = doc(db, fullPath) as DocumentReference<T>;

  return docRef.withConverter(converter<T>());
};

export const dataPointCollectionWithReference = <T extends DocumentData>(
  reference: DocumentReference,
  collectionPath: string,
  ...pathSegments: string[]
) => {
  const collectionFullPath = [collectionPath, ...pathSegments].join("/");

  const collectionRef = collection(
    reference,
    collectionFullPath
  ) as CollectionReference<T>;

  return collectionRef.withConverter(converter<T>());
};

/**
 *
 * @param collectionReference reference to get data from firebase
 * @param conditions conditions to get data from T object
 * @returns a  QuerySnapshot<T, DocumentData>
 */
export const getCollectionWithCondition = async <T>(
  collectionReference: CollectionReference<T>,
  ...conditions: ICondition<T>[]
): Promise<QuerySnapshot<T, DocumentData>> => {
  const queryConstraints = conditions.map((c) =>
    where(c.key as string, c.opStr, c.value)
  );

  const snapshot = await getDocs(
    query(collectionReference, ...queryConstraints)
  );

  return snapshot;
};

// Helper function to extract public ID from the Cloudinary URL
export const extractPublicIdFromUrl = (url: string) => {
  const urlParts = url?.split("/");
  // Find the position of 'upload' in the array
  const uploadIndex = urlParts.indexOf("upload");
  // Extract the public ID based on the position of 'upload'
  const publicIdWithExtension =
    uploadIndex !== -1 ? urlParts.slice(uploadIndex + 2).join("/") : null;

  // Remove the file extension
  const publicIdWithoutExtension = publicIdWithExtension
    ?.split(".")
    .slice(0, -1)
    .join(".");

  // Sanitize the public ID by replacing invalid characters within each part
  const sanitizedPublicId = publicIdWithoutExtension?.replace(
    /[^a-zA-Z0-9_./-]/g,
    "_"
  );
  if (!sanitizedPublicId) {
    console.error("Invalid Cloudinary URL. Public ID not found.");
    return null;
  }

  return sanitizedPublicId;
};
