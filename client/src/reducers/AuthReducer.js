const AuthReducer = (state, action) => {
  switch (action.type) {
    case "AUTHENTICATE_USER":
      return {
        ...state,
        userData: action.userData,
        authenticated: true,
        loading: true,
      };

    case "UNAUTHENTICATE_USER":
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default AuthReducer;
