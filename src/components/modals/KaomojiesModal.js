import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExitSVG, CopySvg } from "../../utilities/icons";
import { OvalContainer } from "../../utilities/spinners";
import modalStyles from "../../style-modules/components/modals.module.css";

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

export default function KaomojiesModal({ toggleModal }) {
  const { status, data } = useQuery(["kaomojies"], fetchKaomojies);
  const modal = useRef();

  function handleOverlayClick(event) {
    if (event.target !== modal.current) toggleModal();
  }

  const ErrorDisplay = (
    <div className={modalStyles.kaomojiesError}>
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
      <div
        className={modalStyles.modalOverlay}
        onClick={handleOverlayClick}
      ></div>
      <div ref={modal} className={modalStyles.modalCardKaomojies}>
        <button className={modalStyles.exitBtn} onClick={toggleModal}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={modalStyles.kaomojiesContent}>
          {status === "success" && data.record?.kaomojies ? (
            data.record.kaomojies.map((item) => (
              <div className={modalStyles.kaomojiCopyWrapper} key={item.id}>
                <div className={modalStyles.kaomojiWrapper}>{item.kaomoji}</div>
                <button
                  className={modalStyles.copyButton}
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
            <OvalContainer />
          ) : null}
        </div>
      </div>
    </>
  );
}
