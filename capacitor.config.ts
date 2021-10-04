import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.teamtasic.ionic',
  appName: 'teamtasic',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',

      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
