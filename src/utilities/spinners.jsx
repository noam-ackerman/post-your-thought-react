import { Hearts, Oval } from "react-loader-spinner";
import spinnersStyles from "../style-modules/components/spinners.module.css";

const HeartsPageLoader = () => {
  return (
    <Hearts
      height="200"
      width="200"
      color="#B5A1FF"
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
      color="#B5A1FF"
      wrapperStyle={{}}
      wrapperClass={spinnersStyles.ovalBtn}
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
      wrapperClass={spinnersStyles.ovalContainer}
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
      wrapperClass={spinnersStyles.ovalThumbnail}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#B5A1FF"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export { HeartsPageLoader, OvalBtn, OvalContainer, OvalLargeThumbnail };
