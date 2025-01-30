import styled from 'styled-components';

export const ModuleCardsWrapper = styled.div`
  display: flex;
  gap: 64px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const NoModulesInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
