import { Hearts, Oval } from "react-loader-spinner";
import styles from "../style-modules/global.module.css";

const HeartsPageLoader = () => {
  return (
    <Hearts
      height="200"
      width="200"
      color="#B5A1FF"
      ariaLabel="hearts-loading"
      wrapperStyle={{}}
      wrapperClass={styles.heartsPageLoader}
      visible={true}
    />
  );
};

const OvalBtn = () => {
  return (
    <Oval
      height={22}
      width={22}
      color="#B5A1FF"
      wrapperStyle={{}}
      wrapperClass={styles.ovalBtn}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#B5A1FF"
      strokeWidth={8}
      strokeWidthSecondary={8}
    />
  );
};

const OvalContainer = () => {
  return (
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
  );
};

const OvalLargeThumbnail = () => {
  return (
    <Oval
      height={138}
      width={138}
      color="#B5A1FF"
      wrapperStyle={{}}
      wrapperClass={styles.ovalThumbnail}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#B5A1FF"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export { HeartsPageLoader, OvalBtn, OvalContainer, OvalLargeThumbnail };
