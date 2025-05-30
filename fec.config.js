// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  appUrl: [
    '/settings/notifications',
    'settings/integrations',
    '/beta/settings/notifications',
  ],
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  frontendCRDPath: path.resolve(__dirname, './.rhcicd/frontend.yaml'),
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  ...(process.env.IS_BETA && { deployment: 'beta/apps' }),
  hotReload: process.env.HOT === 'true',
  routes: {
    ...(process.env.CONFIG_PORT && {
      '/api/chrome-service/v1/static': {
        host: `http://localhost:${process.env.CONFIG_PORT}`,
      },
    }),
  },
  moduleFederation: {
    exposes: {
      './RootApp': path.resolve(__dirname, './src/AppEntry.tsx'),
      './IntegrationsTable': path.resolve(
        __dirname,
        './src/IntegrationsEntry.tsx'
      ),
      './TimeConfig': path.resolve(
        __dirname,
        './src/components/Notifications/TimeConfig.tsx'
      ),
      './ConnectedTimeConfig': path.resolve(
        __dirname,
        './src/components/Notifications/ConnectedTimeConfig.tsx'
      ),
      './DashboardWidget': path.resolve(
        __dirname,
        './src/components/Widgets/EventsWidget'
      ),
      './IntegrationsWizard': path.resolve(
        __dirname,
        './src/pages/Integrations/Create/IntegrationWizard.tsx'
      ),
      './initNotificationScope': path.resolve(
        __dirname,
        './src/components/NotificationsDrawer/initNotificationScope.tsx'
      ),
      './NotificationsDrawerBell': path.resolve(
        __dirname,
        './src/components/NotificationsDrawer/DrawerBell.tsx'
      ),
      './DrawerPanel': path.resolve(
        __dirname,
        './src/components/NotificationsDrawer/DrawerPanel.tsx'
      ),
    },
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          version: '*',
          requiredVersion: '*',
        },
      },
    ],
  },
};
