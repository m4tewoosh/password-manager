import { Card } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled(Card)`
  width: 248px;
  height: 48px;
  border: 1px solid #d9d9d9;
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

export const WebsiteIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const PasswordData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: flex-start;

  > span {
    font-size: 12px;
    max-width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
      border-bottom: 1px solid #d9d9d9;
    }
  }
`;

export const DataWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  svg {
    font-size: 24px;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;

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
