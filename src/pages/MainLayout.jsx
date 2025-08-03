import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div style={{ paddingLeft: "0px", paddingRight: "0px", maxWidth: "1200px", margin: "0 auto" }}>
      {children}
    </div>
  );
};

export default MainLayout;
