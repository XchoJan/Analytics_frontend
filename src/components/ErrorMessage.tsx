import React from 'react';
import './ErrorMessage.css';

interface Props {
  message: string;
}

export const ErrorMessage: React.FC<Props> = ({message}) => (
  <div className="error-message">
    <p>{message}</p>
  </div>
);

