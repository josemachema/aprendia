import { firestore } from './firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export const updateData = async (collection, documentId, newData) => {
  try {
    const docRef = doc(firestore, collection, documentId); // Referencia al documento
    await updateDoc(docRef, newData); // Actualizar datos
    console.log('Documento actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
  }
};
