// ErrorMessage.js
import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ error }) => {
  return error ? <div className="error">{error}</div> : null;
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
