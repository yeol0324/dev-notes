import { Suspense, useState, useTransition } from "react";
import Fabric from "./canvas/fabric/index.tsx";
import Three from "./graphics/three/start/index.tsx";
import Drive from "./graphics/three/drive/index.tsx";
import Profile from "./graphics/three/profile/index.tsx";
import Layout from "./Layout.tsx";
import { Route, Routes, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<BigSpinner />}>
      <Layout isPending={true}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                this is interactive-ux project
                <button onClick={() => navigate("/three")}>Three</button>
              </div>
            }
          />
          <Route path="/fabric" element={<Fabric />} />
          <Route path="/three/start" element={<Three />} />
          <Route path="/three/drive" element={<Drive />} />
          <Route path="/three/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Suspense>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
