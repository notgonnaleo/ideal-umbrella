import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Landing from "./pages/Landing";
import Activity from "./pages/Activity";
import Share from "./pages/Share";

function RootPage() {
  // Discord launches the mapped app at `/` and adds frame_id to the query.
  // Keep the normal landing page for browser visitors while routing the
  // embedded launch to the Activity itself.
  const isDiscordActivity = new URLSearchParams(window.location.search).has("frame_id");
  return isDiscordActivity ? <Activity /> : <Landing />;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootPage,
  },
  {
    path: "/activity",
    Component: Activity,
  },
  {
    path: "/share",
    Component: Share,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
