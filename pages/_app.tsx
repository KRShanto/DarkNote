import "@/styles/globals.scss";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { useThemeStore } from "@/stores/theme";
import { useMediaQuery } from "react-responsive";
import { useMobileStore } from "@/stores/mobile";
import { useViewStore } from "@/stores/view";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import LoadingBar from "react-top-loading-bar";
import { FadeLoader, BounceLoader } from "react-spinners";
import { useLoadingStore } from "@/stores/loading";
import { useRouter } from "next/router";
import { ThemeType } from "@/types/theme";
import { ViewType } from "@/types/view";
import { usePopupStore } from "@/stores/popup";
import LoaderForUser from "@/components/LoaderForUser";
import SideNavbar from "../components/side-navbar/SideNavbar";
import fetcher from "@/lib/fetcher";
import PopupState from "@/components/PopupState";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [progress, setProgress] = useState(0);

  const { setView } = useViewStore();
  const { theme, changeTheme } = useThemeStore();
  const { loading } = useLoadingStore();
  const { setIsMobile } = useMobileStore();
  const { get } = useBooksWithNotesStore();
  const { popup } = usePopupStore();

  // Get the theme and view from local storage
  useEffect(() => {
    const theme = localStorage.getItem("theme") as ThemeType | null;
    const view = localStorage.getItem("view") as ViewType | null;

    if (theme) {
      changeTheme(theme);
    }

    if (view) {
      setView(view);
    }
  }, []);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile]);

  // Progress bar
  useEffect(() => {
    const handleStart = (url: string) => {
      setProgress(30);
    };
    const handleComplete = (url: string) => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Change the body's class based on the theme
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Fetch the books and notes
  useEffect(() => {
    get();
  }, []);

  return (
    <>
      <LoadingBar
        color="rgb(0, 255, 208)"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      {loading && (
        <div className="preloader">
          <BounceLoader className="spinner" color="cyan" loading={loading} />
        </div>
      )}

      <SessionProvider session={session}>
        <PopupState />

        <main style={{ opacity: loading || popup ? 0.2 : 1 }}>
          <Navbar />
          <SideNavbar />

          <div className="main-body">
            <Component {...pageProps} />
          </div>

          <Footer />

          <LoaderForUser />
        </main>
      </SessionProvider>
    </>
  );
}
