import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { LockOutlined, FileOutlined } from '@ant-design/icons';
import getUser from 'api/getUser';
import { ModuleCard } from 'components/ModuleCard/ModuleCard';

import { User } from 'types/user';
import * as S from './Dashboard.styled';

const { Title, Text, Link } = Typography;

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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
        {!user?.passwordsModuleOn && !user?.documentsModuleOn && (
          <S.NoModulesInfo>
            <Title level={1}>No modules enabled</Title>
            <Text>
              Go to <Link onClick={() => navigate('/settings')}>settings</Link>{' '}
              to enable a module
            </Text>
          </S.NoModulesInfo>
        )}
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
