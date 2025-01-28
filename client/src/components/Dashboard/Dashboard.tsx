import { useEffect, useState } from 'react';
import { LockOutlined, FileOutlined } from '@ant-design/icons';
import getUser from 'api/getUser';
import { ModuleCard } from 'components/ModuleCard/ModuleCard';

import { User } from 'types/user';
import * as S from './Dashboard.styled';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await getUser();

        if (user) {
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
        {user?.passwordsModuleOn && (
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
