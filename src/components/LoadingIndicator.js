// LoadingIndicator.js
import React from "react";
import PropTypes from "prop-types";

const LoadingIndicator = ({ isLoading, children }) => {
  return isLoading ? <div className="loading">Cargando...</div> : <>{children}</>;
};

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default LoadingIndicator;
