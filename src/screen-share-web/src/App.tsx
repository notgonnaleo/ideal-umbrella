import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Activity from "./pages/Activity";
import Share from "./pages/Share";

const router = createBrowserRouter([
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
