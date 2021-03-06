import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as ActionTypes from './actionTypes';
import history from '../history';
import { saveAuthToken, clearAuthToken } from './local-storage';

export const requestSavedBooks = () => ({
  type: ActionTypes.REQUEST_SAVED_BOOKS,
});
export const updateSavedBooks = books => ({
  type: ActionTypes.UPDATE_SAVED_BOOKS,
  books,
});
export const tryRemoveBook = () => ({
  type: ActionTypes.TRY_REMOVE_BOOK,
});
export const tryAddBook = () => ({
  type: ActionTypes.TRY_ADD_BOOK,
});
export const removeBookSuccess = book => ({
  type: ActionTypes.REMOVE_BOOK_SUCCESS,
  book,
});
export const addBookSuccess = book => ({
  type: ActionTypes.ADD_BOOK_SUCCESS,
  book,
});
export const updateBookStatusSuccess = (title, status) => ({
  type: ActionTypes.UPDATE_BOOK_STATUS_SUCCESS,
  title,
  status,
});
export const trySearchBooks = () => ({
  type: ActionTypes.TRY_SEARCH_BOOKS,
});
export const updateSearchResults = books => ({
  type: ActionTypes.UPDATE_SEARCH_RESULTS,
  books,
});
export const loginRequest = () => ({
  type: ActionTypes.LOGIN_REQUEST,
});
export const loginSuccess = currentUser => ({
  type: ActionTypes.LOGIN_SUCCESS,
  currentUser,
});
export const registrationRequest = () => ({
  type: ActionTypes.REGISTRATION_REQUEST,
});
export const registrationSuccess = () => ({
  type: ActionTypes.REGISTRATION_SUCCESS,
});
export const clearUser = () => ({
  type: ActionTypes.CLEAR_USER,
});
export const requestSignup = () => ({
  type: ActionTypes.REQUEST_SIGNUP,
});
export const setAuthToken = token => ({
  type: ActionTypes.SET_AUTH_TOKEN,
  token,
});
export const authError = (code, message) => ({
  type: ActionTypes.AUTH_ERROR,
  code,
  message,
});
export const apiError = (code, message) => ({
  type: ActionTypes.API_ERROR,
  code,
  message,
});
export const toggleStyleTheme = theme => ({
  type: ActionTypes.TOGGLE_STYLE_THEME,
  theme,
});
export const clearNotification = () => ({
  type: ActionTypes.CLEAR_NOTIFICATION,
});
export const navigate = route => () => {
  history.push(route);
};
export const updateSearchTerm = searchTerm => ({
  type: ActionTypes.UPDATE_SEARCH_TERM,
  searchTerm,
})


// Stores the auth token in state and localStorage, and decodes and stores
// the user data stored in the token
export const storeAuthInfo = token => (dispatch) => {
  const decodedToken = jwtDecode(token);
  dispatch(setAuthToken(token));
  dispatch(loginSuccess(decodedToken.user));
  saveAuthToken(token);
};

export const login = (fields, actions) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
      JSON.stringify({
        email: fields.email,
        password: fields.password,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const { token } = response.data;
    dispatch(storeAuthInfo(token, dispatch));
    actions.setStatus(null);
    history.push('/library');
  } catch (e) {
    console.log(e);
    const { status } = e.response;
    const message = status === 401
      ? 'Incorrect email or password'
      : 'Unable to login, please try again';
    actions.setStatus(message);
    dispatch(authError(status, message));
    history.push('/login');
  }
};

export const logout = () => (dispatch) => {
  clearAuthToken();
  dispatch(clearUser());
  history.push('/');
};

export const registerUser = (fields, actions) => async (dispatch) => {
  try {
    dispatch(registrationRequest());
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/users`,
      JSON.stringify({
        firstName: fields.name.split(' ')[0],
        lastName: fields.name.split(' ')[1],
        email: fields.email,
        username: fields.username,
        password: fields.password,
      }),
      {
        headers: { 'content-type': 'application/json' },
      },
    );
    actions.setStatus(null);
    dispatch(registrationSuccess());
    dispatch(login(fields, actions));
  } catch (e) {
    const { code, message } = e.response.data;
    actions.setStatus(message);
    dispatch(authError(code, message));
  }
};


export const getSavedBooks = () => async (dispatch, getState) => {
  try {
    dispatch(requestSavedBooks());

    const { token } = getState();

    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/users/books`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.status !== 200) {
      dispatch(apiError(response.status, 'Failed to fetch Books'));
    } else {
      const { books } = response.data;
      dispatch(updateSavedBooks(books));  
    }
  } catch (e) {
    dispatch(apiError(422, e.message));
  }
};

export const removeBook = book => async (dispatch, getState) => {
  dispatch(tryRemoveBook());
  try {
    const { token } = getState();
    await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/users/books/${book.isbn}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    dispatch(removeBookSuccess(book));
  } catch (e) {
    dispatch(apiError(422, e.message));
  }
};

export const addBook = (book, shelfType) => async (dispatch, getState) => {
  dispatch(tryAddBook());
  try {
    const { token } = getState();
    await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/users/books`,
      { ...book, shelf_type: shelfType },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    dispatch(addBookSuccess(book));
  } catch (e) {
    const { data } = e.response;
    dispatch(apiError(data.status, data.message));
  }
};

export const updateBookStatus = (book, newStatus) => async (dispatch, getState) => {
  try {
    const { token } = getState();
    await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/users/books/${book.isbn}/${newStatus}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(getSavedBooks());
    dispatch(updateBookStatusSuccess(book.title, newStatus))
  } catch(e) {
    const { data } = e.response;
    dispatch(apiError(data.status, data.message));
  }
}

export const bookSearch = search => async (dispatch) => {
  dispatch(trySearchBooks());
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/findbook/${search}`,
    );
    dispatch(updateSearchResults(response.data));
    dispatch(navigate('/explore'));
  } catch (e) {
    dispatch(apiError(422, e.message));
  }
};
