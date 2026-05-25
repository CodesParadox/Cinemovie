import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import AppRoutes from './routes/Routes';

export default function App() {
  return (
    <>
      <ErrorBoundary label="Header" silent>
        <Header />
      </ErrorBoundary>

      <ErrorBoundary label="Routes">
        <AppRoutes />
      </ErrorBoundary>

      <ErrorBoundary label="Footer" silent>
        <Footer />
      </ErrorBoundary>
    </>
  );
}
