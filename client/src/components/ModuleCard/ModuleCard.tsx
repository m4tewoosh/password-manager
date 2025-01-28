import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

import * as S from './ModuleCard.styled';

type ModuleCardProps = {
  name: 'Documents' | 'Passwords';
  url: '/documents' | '/passwords';
  icon: ReactElement;
};

export const ModuleCard = ({ name, url, icon }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <S.ModuleCard>
      <S.IconWrapper>{icon}</S.IconWrapper>
      <Button
        htmlType="submit"
        onClick={() => navigate(url)}
        size="large"
        type="primary"
      >
        {name}
      </Button>
    </S.ModuleCard>
  );
};

export default ModuleCard;
