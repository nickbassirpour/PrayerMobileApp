import { Asset } from "expo-asset";

const SODImage0 = Asset.fromModule(
  require("../../assets/SODimages4/161_Decalogue.jpg")
);
const SODImage1 = Asset.fromModule(
  require("../../assets/SODimages6/293_Ju-2.jpg")
);
const SODImage2 = Asset.fromModule(
  require("../../assets/SODimages4/162_Thebaid2.jpg")
);

const SODImageLinks = [
  { imageNum: "image0", asset: SODImage0 },
  { imageNum: "image1", asset: SODImage1 },
  { imageNum: "image2", asset: SODImage2 },
];

export { SODImageLinks };
