const errorMessage = {
  400: "Bad request",
  401: "Email or password is wrong",
  403: "Forbidden",
  409: "Conflict"
}



const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
