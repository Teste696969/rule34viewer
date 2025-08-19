import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/client/Login/index.tsx";
import PageNotFound from "./pages/PageNotFound/index.tsx";
import Register from "./pages/client/Register/index.tsx";
import Home from "./pages/client/Home/index.tsx";
import Viewer from "./pages/client/Viewer/index.tsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
