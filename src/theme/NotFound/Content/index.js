import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function NotFoundContent() {
  const history = useHistory();

  useEffect(() => {
    history.push('/docs/');
  }, [history]);

  return null;
}