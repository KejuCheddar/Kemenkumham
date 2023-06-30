import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer} className="blur-bg">
      <p style={{marginTop: '10px'}}>&copy; 2023 Your Website. By Alexandro Theo</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "rgba(248, 248, 248, 0.8)",
    textAlign: "center",
  },
};

export default Footer;
