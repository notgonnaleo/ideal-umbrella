import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Landing from "./pages/Landing";
import Activity from "./pages/Activity";
import Share from "./pages/Share";

const router = createBrowserRouter([
  {
    path: "/getting-started",
    Component: Landing,
  },
  {
    path: "/",
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
