import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Landing from "./pages/Landing";
import Activity from "./pages/Activity";
import Share from "./pages/Share";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
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
