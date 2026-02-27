import { useEffect, useRef, useState } from "react";
import HomePage from "../homePage/HomePage";
import Home2 from "../home2/Home2";

export default function HomeContainer() {
  const [showHome2, setShowHome2] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowHome2(true);
          observer.disconnect(); // stop observing after trigger
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* SECTION 1 */}
      <section style={{ minHeight: "100vh" }}>
        <HomePage />
      </section>

      {/* INVISIBLE TRIGGER */}
      <div ref={triggerRef} style={{ height: "1px" }} />

      {/* SECTION 2 */}
      {showHome2 && (
        <section style={{ minHeight: "100vh" }}>
          <Home2 />
        </section>
      )}
    </div>
  );
}