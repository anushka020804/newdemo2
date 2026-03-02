import { createBrowserRouter } from "react-router";

import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import App from "./App";
import { BusinessVerification } from "./pages/BusinessVerification";
import { HSNSetup } from "./pages/HSNSetup";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { MarketingLandingPage } from "./pages/MarketingLandingPage";
import AboutPage from "./pages/AboutPage";
import MetalCapitalLanding from "./pages/MetalCapitalLanding";
import { PortalPage } from "./pages/PortalPage";
import { SignupPage } from "./pages/SignupPage";
import { TenderListing } from "./pages/TenderListing";
import { SavedBids } from "./pages/SavedBids";
import { WonBids } from "./pages/WonBids";
import { UserProfile } from "./pages/UserProfile";
import { CompleteProfile } from "./pages/CompleteProfile";
import { TenderDetails } from "./pages/TenderDetails";
import { Analysis1 } from "./pages/Analysis1";
import { BidDocumentPreparation } from "./pages/BidDocumentPreparation";
import { GeneratedBidDocuments } from "./pages/GeneratedBidDocuments";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";

export const router = createBrowserRouter([
  // ─── Fully public pages (anyone can access) ─────────────────────────────
  { path: "/", Component: MarketingLandingPage },
  { path: "/about", Component: AboutPage },
  { path: "/metalcapital", Component: MetalCapitalLanding },
  { path: "/portal", Component: PortalPage },

  // ─── Public-only pages (redirect to /dashboard if already logged in) ────
  {
    Component: PublicOnlyRoute,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/signup", Component: SignupPage },
      { path: "/verify-business", Component: BusinessVerification },
      { path: "/hsn-setup", Component: HSNSetup },
      { path: "/welcome", Component: WelcomeScreen },
    ],
  },

  // ─── Protected pages (redirect to /login if not logged in) ──────────────
  {
    Component: ProtectedRoute,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "/tenders", Component: TenderListing },
      { path: "/tender/:id", Component: TenderDetails },
      { path: "/analysis1/:id", Component: Analysis1 },
      { path: "/bid-preparation/:id", Component: BidDocumentPreparation },
      { path: "/tender/:id/generated-documents", Component: GeneratedBidDocuments },
      { path: "/saved-bids", Component: SavedBids },
      { path: "/won-bids", Component: WonBids },
      { path: "/profile", Component: UserProfile },
      { path: "/complete-profile", Component: CompleteProfile },
    ],
  },

  // ─── Legacy app shell ───────────────────────────────────────────────────
  { path: "/app", Component: App, children: [] },
]);