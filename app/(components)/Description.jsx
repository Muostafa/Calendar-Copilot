import React from "react";
import styles from "../../styles/description.module.css";

const Description = ({title, text}) => {
  return (
    <div className={styles.description}>
      <div className={styles.title}><h1 >{title}</h1></div>
      <div className={styles.text}><p>{text}</p></div>
    </div>
  );
};

export default Description;
