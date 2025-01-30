import { Card } from 'antd';
import styled from 'styled-components';

export const ModuleCard = styled(Card)`
  width: 240px;
  height: 240px;
  border-radius: 30px;
  box-shadow: 0px 0px 15px 0px #00000033;

  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 36px;

    .anticon {
      font-size: 64px;
    }
  }
`;

export const IconWrapper = styled.div``;
