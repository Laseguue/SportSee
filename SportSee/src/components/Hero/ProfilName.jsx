import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/api';

function ProfilName({ userId = 12 }) {
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const data = await getCurrentUser({ signal: controller.signal });

        let userInfo = data.user;
        if (!userInfo) {
          userInfo = data;
        }

        let name = '';
        if (userInfo && userInfo.userInfos && userInfo.userInfos.firstName) {
          name = userInfo.userInfos.firstName;
        }

        setFirstName(name);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setLoadError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [userId]);

  if (isLoading) {
    return <div className="profil-greet">Chargement…</div>;
  }

  if (loadError) {
    return <div className="profil-greet">Une erreur est survenue.</div>;
  }

  return (
    <div className="profil-greet">
      <div className='profil-name'>
        <h1>Bonjour </h1>
        <h1 className='user-prenom'>{firstName}</h1>
      </div>
      <p>Félicitation ! Vous avez explosé vos objectifs hier 👏</p>
    </div>
  );
}

export default ProfilName;