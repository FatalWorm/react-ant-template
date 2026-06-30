/**
 * @module PostsPage
 * @description Страница входа — обёртка над LoginForm с центрированным layout.
 */

import { theme } from 'antd';

import { PostList } from '@/Features/Post';

import { PageWrapper } from '@/Shared/Ui';

export default function LoginPage() {
  const { token } = theme.useToken();

  return (
    <PageWrapper
      style={{
        padding: '0',
        height: `calc(100vh - ${token.mainLayout.headerHeight + token.mainLayout.footerHeight}px)`,
      }}
    >
      <PostList />
    </PageWrapper>
  );
}
