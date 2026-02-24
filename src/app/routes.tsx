import { createBrowserRouter } from "react-router";

import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import App from "./App";
import { BusinessVerification } from "./pages/BusinessVerification";
import { HSNSetup } from "./pages/HSNSetup";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { MarketingLandingPage } from "./pages/MarketingLandingPage";
import AboutPage from "./pages/AboutPage";
// import OpportunityXLanding from "./pages/OpportunityXLanding";
import MetalCapitalLanding from "./pages/MetalCapitalLanding";
import { PortalPage } from "./pages/PortalPage";
import { SignupPage } from "./pages/SignupPage";
import { TenderListing } from "./pages/TenderListing";
import { SavedBids } from "./pages/SavedBids";
import { WonBids } from "./pages/WonBids";
import { UserProfile } from "./pages/UserProfile";
import { CompleteProfile } from "./pages/CompleteProfile";
import { TenderDetails } from "./pages/TenderDetails";

export const router = createBrowserRouter([
      {
        path: "/about",
        Component: AboutPage,
      },
    // OpportunityX route removed; handled by root '/'.
    {
      path: "/metalcapital",
      Component: MetalCapitalLanding,
    },
  {
    path: "/",
    Component: MarketingLandingPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/portal",
    Component: PortalPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/verify-business",
    Component: BusinessVerification,
  },
  {
    path: "/hsn-setup",
    Component: HSNSetup,
  },
  {
    path: "/welcome",
    Component: WelcomeScreen,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/tenders",
    Component: TenderListing,
  },
  {
    path: "/saved-bids",
    Component: SavedBids,
  },
  {
    path: "/won-bids",
    Component: WonBids,
  },
  {
    path: "/profile",
    Component: UserProfile,
  },
  {
    path: "/complete-profile",
    Component: CompleteProfile,
  },
  {
    path: "/tender/:id",
    Component: TenderDetails,
  },
  {
    path: "/app",
    Component: App,
    children: [],
  },
]);