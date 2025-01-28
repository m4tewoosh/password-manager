import { useEffect } from 'react';
import { LockOutlined, FileOutlined } from '@ant-design/icons';
import useStore from 'store/store';
import getUser from 'api/getUser';
// import { useAuth } from 'hooks/useAuth';
import { ModuleCard } from 'components/ModuleCard/ModuleCard';

import * as S from './Dashboard.styled';

const Dashboard = () => {
  const { user, setUser } = useStore();

  // const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await getUser();

        if (user) {
          // setIsLoggedIn(true);
          setUser(user);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, [setUser]);

  return (
    <div>
      <S.ModuleCardsWrapper>
        {user?.passwordModuleOn && (
          <ModuleCard
            icon={<LockOutlined />}
            name="Passwords"
            url="/passwords"
          />
        )}

        {user?.documentsModuleOn && (
          <ModuleCard
            icon={<FileOutlined />}
            name="Documents"
            url="/documents"
          />
        )}
      </S.ModuleCardsWrapper>
    </div>
  );
};

export default Dashboard;
