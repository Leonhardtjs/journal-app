import {
  loginWithEmailPassword,
  logoutFirebase,
  registerUserWithEmailPassword,
  signInWithGoogle,
} from '../../../src/firebase/providers';
import { checkingCredentials, login, logout } from '../../../src/store/auth';
import { clearNotesLogout } from '../../../src/store/journal';
import {
  checkingAuthentication,
  startCreatingUserWithEmailAndPassword,
  startGoogleSignIn,
  startLoginWithEmailAndPassword,
  startLogout,
} from '../../../src/store/auth/thunks';
import { demoUser } from '../../fixtures/authFixtures';
jest.mock('../../../src/firebase/providers');

describe('Pruebas en AuthThunks', () => {
  const dispatch = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test('debe invocar el checkingCredentials', async () => {
    await checkingAuthentication()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
  });

  test('startGoogleSignIn debe llamar el checkingCredentials y login - Exito', async () => {
    const loginData = { ok: true, ...demoUser };

    await signInWithGoogle.mockResolvedValue(loginData);

    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login(loginData));
  });

  test('startGoogleSignIn debe llamar el checkingCredentials y logout - Error', async () => {
    const loginData = { ok: false, errorMessage: 'Un error en google' };

    await signInWithGoogle.mockResolvedValue(loginData);

    await startGoogleSignIn()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(logout(loginData.errorMessage));
  });

  test('startCreatingUserWithEmailAndPassword  debe llamar el checkingCredentials y login - Exito', async () => {
    const loginData = { ok: true, ...demoUser };
    const formData = {
      email: demoUser.email,
      password: '123456',
      displayName: demoUser.displayName,
    };
    await registerUserWithEmailPassword.mockResolvedValue(loginData);

    await startCreatingUserWithEmailAndPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login({ ...demoUser }));
  });

  test('startCreatingUserWithEmailAndPassword  debe llamar el checkingCredentials y logout - Error', async () => {
    const loginData = { ok: false, errorMessage: 'Error de login' };
    const formData = {
      email: demoUser.email,
      password: '123456',
      displayName: demoUser.displayName,
    };
    await registerUserWithEmailPassword.mockResolvedValue(loginData);

    await startCreatingUserWithEmailAndPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(logout({ errorMessage: loginData.errorMessage }));
  });

  test('startLoginWithEmailAndPassword debe de llamar checkingCredentials y login - Exito', async () => {
    const loginData = { ok: true, ...demoUser };
    const formData = { email: demoUser.email, password: '123456' };
    await loginWithEmailPassword.mockResolvedValue(loginData);

    await startLoginWithEmailAndPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(login(loginData));
  });

  test('startLoginWithEmailAndPassword debe de llamar checkingCredentials y logout - Error', async () => {
    const loginData = { ok: false, errorMessage: 'Un error de login' };
    const formData = { email: demoUser.email, password: '123456' };
    await loginWithEmailPassword.mockResolvedValue(loginData);

    await startLoginWithEmailAndPassword(formData)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    expect(dispatch).toHaveBeenCalledWith(logout(loginData));
  });

  test('startLogout debe de llamar logoutFirebase, clearNotes y logout', async () => {
    await startLogout()(dispatch);
    expect(logoutFirebase).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
    expect(dispatch).toHaveBeenCalledWith(logout());
  });
});
