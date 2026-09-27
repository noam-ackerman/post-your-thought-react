import { Heading } from "@/atoms";
import errorPageStyles from "@/style-modules/pages/errorPage.module.css";

export function ErrorPage() {
  return (
    <>
      <div className={errorPageStyles.container}>
        <Heading level="main">Something Went Wrong :(</Heading>
        <div className={errorPageStyles.text}>
          Try to refresh the page or return later.
          <br />
          If this error still occurs,
          <br />
          Please contact me at{" "}
          <a href="mailto:developer.noam@gmail.com">
            developer.noam@gmail.com
          </a>{" "}
          <br />
          and describe your scenario!
        </div>
        <Heading level="secondary">Thank you and apologies!</Heading>
      </div>
    </>
  );
}
