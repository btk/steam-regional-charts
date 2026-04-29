import Home from '../index';

export default function RegionPage({ initialRegion }) {
  return <Home initialRegion={initialRegion} />;
}

export async function getServerSideProps({ params }) {
  const code = params?.code?.toLowerCase() || '';

  if (code === 'us') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {
      initialRegion: code,
    },
  };
}
