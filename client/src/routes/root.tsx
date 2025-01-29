import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, theme } from 'antd';
import AuthProvider from 'services/AuthProvider';
import Header from 'components/Header/Header';
import { RootWrapper } from 'components/RootWrapper/RootWrapper.styled';

const layoutStyle = {
  minHeight: '100vh',
  minWidth: '100vw',
  justifyContent: 'center',
  alignItems: 'center',
};

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  components: {
    Layout: {
      headerBg: '#fff',
    },
  },
};
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  components: {
    Layout: {
      headerBg: '#141414',
    },
  },
};

const Root = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode) {
      setIsDarkMode(JSON.parse(darkMode));
    }
  }, []);

  return (
    <AuthProvider>
      <RootWrapper>
        <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
          <Header setIsDarkMode={setIsDarkMode} />
          <Layout style={layoutStyle}>
            <Outlet />
          </Layout>
        </ConfigProvider>
      </RootWrapper>
    </AuthProvider>
  );
};

export default Root;
