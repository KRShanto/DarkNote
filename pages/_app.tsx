import "@/styles/globals.scss";
import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { useThemeStore } from "@/stores/theme";
import { useMediaQuery } from "react-responsive";
import { useMobileStore } from "@/stores/mobile";
import { useBooksWithNotesStore } from "@/stores/booksWithNotes";
import LoadingBar from "react-top-loading-bar";
import { FadeLoader } from "react-spinners";
import { useLoadingStore } from "@/stores/loading";
import { useRouter } from "next/router";
import { ThemeType } from "@/types/theme";
import { usePopupStore } from "@/stores/popup";
import SideNavbar from "../components/side-navbar/SideNavbar";
import PopupState from "@/components/PopupState";
import { useSession, signIn } from "next-auth/react";
import { FaLock } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [progress, setProgress] = useState(0);

  const { theme, changeTheme } = useThemeStore();
  const { loading } = useLoadingStore();
  const { setIsMobile } = useMobileStore();
  const { get } = useBooksWithNotesStore();
  const { popup } = usePopupStore();

  // Get the theme and view from local storage
  useEffect(() => {
    const theme = localStorage.getItem("theme") as ThemeType | null;

    if (theme) {
      changeTheme(theme);
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
          <FadeLoader className="spinner" color="cyan" loading={loading} />
        </div>
      )}

      <SessionProvider session={session}>
        <Main
          Component={Component}
          pageProps={pageProps}
          loading={loading}
          popup={popup}
        />
      </SessionProvider>
    </>
  );
}

function Main({
  Component,
  pageProps,
  loading,
  popup,
}: {
  Component: any;
  pageProps: any;
  loading: boolean;
  popup: string | null;
}) {
  const { data: userSession } = useSession();

  if (!userSession) {
    // return intro.
    return (
      <div className="intro">
        <h1>
          Welcome to <span className="logo">Dark Note</span>
        </h1>

        <p>
          Dark Note is a note taking app that allows you to create notes and
          notebooks.
        </p>

        <div className="features">
          <h2>Features</h2>

          <div className="feature">
            <p>
              <FaLock className="icon" />
              Lock your notes with a password so that only you can view them.
            </p>
          </div>

          <div className="feature">
            <p>
              {" "}
              <FaUserFriends className="icon" />
              Share your notes with your friends and work on them together.
            </p>
          </div>

          <div className="feature">
            <p>
              <FaBook className="icon" />
              Create notebooks and organize your notes by adding them to
              notebooks.
            </p>
          </div>
        </div>

        <button onClick={() => signIn()} className="btn blue">
          Get Started
        </button>
      </div>
    );
  }

  return (
    <>
      <PopupState />
      <main style={{ opacity: loading || popup ? 0.2 : 1 }}>
        <Navbar />
        <SideNavbar />

        <div className="main-body">
          <Component {...pageProps} />
        </div>

        <Footer />
      </main>
    </>
  );
}
