import footerStyles from "@/style-modules/components/footer.module.css";

export function Footer() {
  return (
    <div className={footerStyles.footer}>
      This site is an{" "}
      <a
        href="https://github.com/noam-ackerman/post-your-thought-react"
        target="_blank"
        rel="noreferrer"
      >
        open-source code
      </a>{" "}
      designed and built by{" "}
      <a
        href="https://www.linkedin.com/in/noam-ackerman/"
        target="_blank"
        rel="noreferrer"
      >
        Noam Ackerman
      </a>
    </div>
  );
}
