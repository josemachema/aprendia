import { firestore } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export const updateDocument = async (collection, documentId, data) => {
  try {
    const docRef = doc(firestore, collection, documentId); // Referencia al documento
    await updateDoc(docRef, data); // Actualizar datos
    console.log('Documento actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
  }
};
