import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "@/style-modules/global.module.css";

export function Avatar({ to, src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const wrapperClassName = className
    ? `${styles.profileImgThumbnailWrapper} ${className}`
    : styles.profileImgThumbnailWrapper;

  const image = (
    <img
      className={styles.profileImgThumbnail}
      src={src}
      alt={alt}
      style={{ display: loaded ? "block" : "none" }}
      onLoad={() => setLoaded(true)}
    />
  );

  return to ? (
    <Link to={to} className={wrapperClassName}>
      {image}
    </Link>
  ) : (
    <div className={wrapperClassName}>{image}</div>
  );
}
