import React from "react";
 
const Footer = () => {
    return (
        <div style={{
            padding: "1px",
            background: "black",
            position: "absolute",
            bottom: "0px",
            width: "100%",
            }}>

            <h5 style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: "10px",
                }}>
                Computer Science Master's Project - Florida State University
            </h5>
            
            <p style={{
                    color: "white",
                    textAlign: "center",
                    marginBottom: "10px",
                }}>
                Jayen Lare - jsl19b@fsu.edu
            </p>
        </div>
    );
};
export default Footer;