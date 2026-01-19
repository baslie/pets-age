import GoogleAnalytics from './GoogleAnalytics';
import YandexMetrika from './YandexMetrika';

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <YandexMetrika />
    </>
  );
}

export { GoogleAnalytics, YandexMetrika };
