import React, { useContext } from 'react';
import { AuthorizedFetchContext } from '../ContextProviders/authContext';

interface GenericButtonProps {
  endpoint: string;
  method: string;
  buttonText: string;
  props?: object;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  endpoint,
  method,
  buttonText,
  props,
  className,
  onSuccess,
  onError,
}) => {
  const { fetchWithToken } = useContext(AuthorizedFetchContext);

  const handleClick = async () => {
    try {
      const response = await fetchWithToken(endpoint, {
        method,
        body: props ? JSON.stringify(props) : undefined,
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok && onSuccess) {
        onSuccess();
      } else if (!response.ok && onError) {
        onError(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export default GenericButton;