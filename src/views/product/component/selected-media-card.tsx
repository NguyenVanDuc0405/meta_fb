import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteIcon, ImageIcon } from "@shopify/polaris-icons";
import { memo } from "react";
import { ECloudinary } from "../../../constants";
import sha1 from 'crypto-js/sha1';
import { enc } from 'crypto-js';
import axios from "axios";

interface ISelectedMediaCard {
  imageUrl: string;
  filename: string;
  setImage: Function;
}



export default memo(function SelectedMediaCard(props: ISelectedMediaCard) {
  const { imageUrl, filename, setImage } = props;



  const handleUpload = async (file: any) => {
    const formData = new FormData();
    const cloudName = ECloudinary.CLOUDINARY_CLOUD_NAME;
    formData.append('file', file);
    formData.append('upload_preset', ECloudinary.CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', cloudName)
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    setImage(data.secure_url);
  };
  const generateSHA1 = (data: string) => {
    return sha1(data).toString(enc.Hex);
  };

  const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
      const getPublicIdFromUrl = (url: string) => {
        const match = url.match(regex);
        return match ? match[1] : null;
      };
      const publicId = getPublicIdFromUrl(imageUrl);
      const cloudName = ECloudinary.CLOUDINARY_CLOUD_NAME;
      const timestamp = new Date().getTime();
      const apiKey = ECloudinary.CLOUDINARY_API_KEY;
      const apiSecret = ECloudinary.CLOUDINARY_API_SECRET;
      const signature = generateSHA1(generateSignature(publicId as string, apiSecret));
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

      const response = await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      console.error(response);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <Box
      borderColor="border"
      borderWidth="025"
      borderRadius="200"
      padding={"300"}
    >
      <InlineStack
        wrap={false}
        gap={"200"}
        blockAlign="center"
        align="space-between"
      >
        <Box width="calc(100% - 150px)">
          <InlineStack
            wrap={false}
            gap={"200"}
            blockAlign="center"
            align="start"
          >
            <Thumbnail
              size="large"
              source={imageUrl ? imageUrl : ImageIcon}
              alt="Onetick upsell checkbox"
            />
            <Box width="100%">
              <BlockStack gap={"100"} inlineAlign="start">
                <Box width="100%">
                  <Text as="span" variant="bodySm" truncate>
                    {filename}
                  </Text>
                </Box>
              </BlockStack>
            </Box>
          </InlineStack>
        </Box>
        <ButtonGroup>
          <input
            type="file"
            id="upload-file"
            style={{ display: "none" }}
            accept="image/gif, image/jpg ,image/jpeg, image/png"
            multiple={false}
            onChange={(e: any) => {
              const file = e.target.files[0];
              handleUpload(file);
            }}
          />
          <label
            htmlFor="upload-file"
            className="Polaris-Button Polaris-Button--pressable Polaris-Button--variantSecondary Polaris-Button--sizeMedium Polaris-Button--textAlignCenter"
            style={{ fontSize: 12 }}
          >
            Chỉnh sửa
          </label>

          <Button
            icon={DeleteIcon}
            onClick={() => {
              setImage(() => "");
            }}
          />
        </ButtonGroup>
        <Button onClick={() => deleteImage("http://res.cloudinary.com/ptd/image/upload/v1711542525/mlpfnieejja2jkfpdks8.jpg")}>Test image</Button>
      </InlineStack>
    </Box>
  );
});
