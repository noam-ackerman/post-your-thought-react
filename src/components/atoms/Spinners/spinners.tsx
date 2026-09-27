import { Hearts, Oval } from "react-loader-spinner";
import spinnersStyles from "./spinners.module.css";

const HeartsPageLoader = () => {
  return (
    <Hearts
      height="200"
      width="200"
      color="var(--color-spinner-accent)"
      ariaLabel="hearts-loading"
      wrapperStyle={{}}
      wrapperClass={spinnersStyles.heartsPageLoader}
      visible={true}
    />
  );
};

const OvalBtn = () => {
  return (
    <Oval
      height={22}
      width={22}
      color="var(--color-spinner-accent)"
      wrapperStyle={{}}
      wrapperClass={spinnersStyles.ovalBtn}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="var(--color-spinner-accent)"
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
      color="var(--color-spinner-accent)"
      wrapperStyle={{}}
      wrapperClass={spinnersStyles.ovalContainer}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="var(--color-spinner-accent)"
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
      color="var(--color-spinner-accent)"
      wrapperStyle={{}}
      wrapperClass={spinnersStyles.ovalThumbnail}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="var(--color-spinner-accent)"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export { HeartsPageLoader, OvalBtn, OvalContainer, OvalLargeThumbnail };
