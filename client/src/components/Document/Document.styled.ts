import { Card } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled(Card)`
  width: 248px;
  min-height: 48px;
  border-radius: 4px;

  .ant-card-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    height: 100%;

    &:before,
    &:after {
      display: none;
    }
  }
`;

export const DocumentIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const DocumentName = styled.p`
  max-width: 104px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  white-space: nowrap;
`;

export const DataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  svg {
    font-size: 24px;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 8px;

  > button {
    border: unset;
    background: unset;

    svg {
      font-size: 18px;
    }

    &:hover {
      cursor: pointer;
    }
  }
`;
