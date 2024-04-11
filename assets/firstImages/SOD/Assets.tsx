import { Asset } from "expo-asset";

const Image0 = Asset.fromModule(
  require("../../assets/SODimages4/161_Decalogue.jpg")
);
const Image1 = Asset.fromModule(
  require("../../assets/SODimages6/293_Ju-2.jpg")
);
const Image2 = Asset.fromModule(
  require("../../assets/SODimages4/162_Thebaid2.jpg")
);

const Image3 = Asset.fromModule(
              require("../../assets/SODimages2/065_Egypt.jpg")
            );const Image4 = Asset.fromModule(
              require("../../assets/SODimages2/065_Egypt.jpg")
            );const SODImageLinks = [
  { image: "SODimages4/161_Decalogue.jpg", asset: Image0 },
  { image: "SODimages6/293_Ju-2.jpg", asset: Image1 },
  { image: "SODimages4/162_Thebaid2.jpg", asset: Image2 },
{ image: "SODimages2/065_Egypt.jpg", asset: Image3},{ image: "SODimages2/065_Egypt.jpg", asset: Image4},];

export { SODImageLinks };
