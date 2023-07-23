import React, { useRef } from "react";
import { useQuery } from "react-query";
import { ExitSVG, CopySvg } from "../resources/logos";
import { Oval } from "react-loader-spinner";
import styles from "../../style-modules/style.module.css";

const fetchKaomojies = async () => {
  const res = await fetch(
    "https://api.jsonbin.io/v3/b/648c215b9d312622a3706eac",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-Master-Key": process.env.REACT_APP_JSONBIN_MASTER_KEY,
      },
    }
  );
  return res.json();
};

export default function KaomojiesModal(props) {
  const { status, data } = useQuery("kaomojies", fetchKaomojies);
  const modal = useRef();

  function handleOverlayClick(event) {
    if (event.target !== modal.current) {
      props.toggleModal();
    }
  }

  const ErrorDisplay = (
    <div className={styles.errorPageMessage}>
      Something Went Wrong (*꒦ິ⌒꒦ີ)
      <br />
      Try Again Later!
      <br />
      If this error still occurs,
      <br />
      Please report to
      <br />
      <a href="mailto:developer.noam@gmail.com">
        developer.noam@gmail.com
      </a>{" "}
      <br />
    </div>
  );

  return (
    <>
      <div className={styles.modalOverlay} onClick={handleOverlayClick}></div>
      <div ref={modal} className={styles.modalCardKaomojies}>
        <button
          className={styles.exitBtn}
          onClick={() => {
            props.toggleModal();
          }}
        >
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={styles.kaomojiesContent}>
          {status === "success" && data.record?.kaomojies ? (
            data.record.kaomojies.map((item) => (
              <div className={styles.kaomojiCopyWrapper} key={item.id}>
                <div className={styles.kaomojiWrapper}>{item.kaomoji}</div>
                <button
                  className={`${styles.postSubmitbutton} ${styles.copyButton}`}
                  onClick={(e) => {
                    const self = e.currentTarget;
                    self.style.backgroundColor = "#c1f7dc";
                    navigator.clipboard.writeText(item.kaomoji);
                    setTimeout(() => {
                      self.style.backgroundColor = "#eda4bd";
                    }, 1000);
                  }}
                >
                  <CopySvg color="#fff" height="16px" width="16px" />
                </button>
              </div>
            ))
          ) : (status === "success" && !data.record?.kaomojies) ||
            status === "error" ? (
            ErrorDisplay
          ) : status === "loading" ? (
            <Oval
              height={138}
              width={138}
              color="#B5A1FF"
              wrapperStyle={{}}
              wrapperClass={styles.ovalContainer}
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#B5A1FF"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
