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

const colorPrimary = '#1677ff';

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary,
  },
  components: {
    Layout: {
      headerBg: '#fff',
    },
  },
};
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary,
  },
  components: {
    Layout: {
      headerBg: '#141414',
      colorBgLayout: '#1d1f26',
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
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Layout style={layoutStyle}>
            <Outlet />
          </Layout>
        </ConfigProvider>
      </RootWrapper>
    </AuthProvider>
  );
};

export default Root;
