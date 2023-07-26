import { collection, deleteDoc, getDocs } from 'firebase/firestore/lite';
import {
  addNewEmptyNote,
  savingNewNote,
  setActiveNote,
  setNotes,
} from '../../../src/store/journal/journalSlice';
import { startLoadingNotes, startNewNote } from '../../../src/store/journal/thunks';
import { FirebaseDB } from '../../../src/firebase/config';

describe('Pruebas en Journal Thunks', () => {
  const uid = 'TEST-UID';
  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeAll(() => jest.clearAllMocks());

  afterEach(async () => {
    const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);
    const docs = await getDocs(collectionRef);
    const deletePromises = [];
    docs.forEach((doc) => deletePromises.push(deleteDoc(doc.ref)));
    await Promise.all(deletePromises);
  });

  test('debe de crear una nueva nota en blanco', async () => {
    getState.mockReturnValue({ auth: { uid: uid } });
    await startNewNote()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(savingNewNote());
    expect(dispatch).toHaveBeenCalledWith(
      addNewEmptyNote({
        body: '',
        title: '',
        id: expect.any(String),
        date: expect.any(Number),
        imageUrls: [],
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveNote({
        body: '',
        title: '',
        id: expect.any(String),
        date: expect.any(Number),
        imageUrls: [],
      }),
    );
  });
  test('debe de cargar las notas', async () => {
    getState.mockReturnValue({ auth: { uid: uid } });
    await startNewNote()(dispatch, getState);

    await startLoadingNotes()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(
      setNotes([
        {
          id: expect.any(String),
          date: expect.any(Number),
          imageUrls: expect.any(Array),
          title: '',
          body: '',
        },
      ]),
    );
  });
});
