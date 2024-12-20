import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
//firebase config
import { db } from "./firebase";
// interfaces
import { ICondition } from "@/data/interfaces/condition.interface";
// constants
import { pathFirebase } from "@/data/constants";

/**
 * Generic converter function
 * @returns a custom model objects with Firestore.
 */
function converter<T extends DocumentData>() {
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

/**
 * Generic function that return a collection with custom model objects with Firestore
 * @param path a slash-separated path to a collection
 * @returns a CollectionReference that uses the provided converter
 */
export const collectionReference = <T extends DocumentData>(
  path: pathFirebase
): CollectionReference<T, DocumentData> => {
  const collectionRef = collection(db, path) as CollectionReference<T>;

  return collectionRef.withConverter(converter<T>());
};

/**
 * Generic function that return a document with custom model object with Firestore
 * @param path a slash-separated path to a document.
 * @param pathSegments additional path segments that will be applied relative to the first argument.
 * @returns a DocumentReference that uses the provided converter
 */
export const documentReference = <T extends DocumentData>(
  path: pathFirebase,
  ...pathSegments: string[]
): DocumentReference<T, DocumentData> => {
  const fullPath = [path, ...pathSegments].join("/");
  const docRef = doc(db, fullPath) as DocumentReference<T>;

  return docRef.withConverter(converter<T>());
};

/**
 * Generic function that return a document with custom model object with Firestore by Firestore Reference
 * @param reference a reference to a Firestore document
 * @param path a slash-separated path to a collection
 * @param pathSegments additional path segments that will be applied relative to the first argument
 * @returns a CollectionReference that uses the provided converter
 */
export const collectionReferenceByDoc = <T extends DocumentData>(
  reference: DocumentReference,
  path: pathFirebase,
  ...pathSegments: string[]
): CollectionReference<T, DocumentData> => {
  const collectionFullPath = [path, ...pathSegments].join("/");

  const collectionRef = collection(
    reference,
    collectionFullPath
  ) as CollectionReference<T>;

  return collectionRef.withConverter(converter<T>());
};

/**
 * Generic function that executes the query and returns the results as a QuerySnapshot
 * @param collectionReference must be the object that return collectionReference or collectionReferenceByDoc
 * @param conditions the list of QueryConstraints to apply
 * @returns  a Promise<QuerySnapshot<T, DocumentData>> that will be resolved with the results of the query
 */
export const getCollectionByQueryFirebase = async <T>(
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

/**
 * Generic function that executes the query and returns the results as a QuerySnapshot
 * @param collectionReference must be the object that return collectionReferenceByDoc or collectionReference
 * @returns a Promise<QuerySnapshot<T, DocumentData>> that will be resolved with the results of the query
 */
export const getCollectionFirebase = async <T>(
  collectionReference: CollectionReference<T>
): Promise<QuerySnapshot<T, DocumentData>> => {
  const snapshot = await getDocs(collectionReference);

  return snapshot;
};

/**
 * Generic function that reads the document referred to by this DocumentReference
 * @param reference must be the object that return documentReference
 * @returns a Promise<DocumentSnapshot<T, DocumentData>> resolved with a DocumentSnapshot containing the current document contents
 */
export const getDataFirebase = async <T>(
  reference: DocumentReference<T>
): Promise<DocumentSnapshot<T, DocumentData>> => {
  const snapshot = await getDoc(reference);

  return snapshot;
};
