import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
  isPending: boolean;
};
export default function Layout({ children, isPending }: LayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="layout">
      <section
        className="header"
        style={{
          opacity: isPending ? 0.7 : 1,
        }}
      ></section>
      <main>
        <button onClick={() => navigate("/")}>home</button>
        {children}
      </main>
    </div>
  );
}
