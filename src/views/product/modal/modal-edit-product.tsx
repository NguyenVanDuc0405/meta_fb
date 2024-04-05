import {
  BlockStack,
  Box,
  Button,
  Icon,
  Modal,
  Popover,
  Scrollable,
  Text,
  TextField,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { EModal } from "../../../constants";
import { useModal } from "../../../hook/useModal";
import { Category, Product } from "../../../interface";
import { CategoryListItem } from "../CategoryListItem";
import DropZoneImage from "../component/drop-zone-image";
import SelectedMediaCard from "../component/selected-media-card";

const EErrorText = {
  Empty: (name: string) => `${name} không được để trống.`,
  InvalidNumber: (name: string) => `${name} phải là số nguyên.`,
  NumberLessZezo: (name: string) => `${name} phải là không âm.`,
};

const ModalEditProduct = () => {
  const { state, openModal, closeModal } = useModal();
  const data = state[EModal.MODAL_EDIT_PRODUCT]?.data || [];
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>();
  const [isCreatedNewCategory, setIsCreateNewCategory] = useState(false);
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategorys, setSelectedCategorys] = useState<Category[]>([
    {
      id: data[8] || "",
      name: data[3] || "",
      isDeleted: false,
    },
  ]);

  const fetchProduct = async (id: number) => {
    await axios
      .get(`http://54.199.68.197:8081/api/v1/products/${id}`)
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCategory = async () => {
    await axios
      .get(`http://54.199.68.197:8081/api/v1/category`)
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        setListCategory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data[0]) {
      setIsLoading(true);
      fetchProduct(data[0])
        .then(() => fetchCategory())
        .then(() => setIsLoading(false));
    } else {
      fetchCategory().then(() => setIsLoading(false));
      setProduct(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data[0]]);

  const [id] = data;
  const [name, setName] = useState(data[1] || "");
  const [image, setImage] = useState(data[2] || "");
  const [price, setPrice] = useState(data[4] || 0);
  const [quantity, setQuantity] = useState(data[5] || 0);
  const [description, setDescription] = useState(data[7]);
  const [category, setCategory] = useState({
    id: data[7] || "",
    name: data[3] || "",
  });

  const [isActivePopoverCategory, setIsActivePopoverCategory] = useState(false);

  const [errorNameText, setErrorNameText] = useState("");
  const [errorCategoryText, setErrorCategoryText] = useState("");
  const [errorPriceText, setErrorPriceText] = useState("");
  const [errorQuantityText, setErrorQuantityText] = useState("");

  useEffect(() => {
    setName(data[1] || "");
    setImage(data[2] || "");
    setPrice(data[4] || 0);
    setQuantity(data[5] || 0);
    setDescription(data[6]);
    setCategory({
      id: data[7] || "",
      name: data[3] || "",
    });
    setErrorNameText("");
    setErrorPriceText("");
    setErrorQuantityText("");
    setErrorCategoryText("");
    setSelectedCategorys([
      {
        id: data[7] || "",
        name: data[3] || "",
        isDeleted: false,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([data])]);

  const handleSaveProduct = async () => {
    let isError = false;
    if (!name) {
      setErrorNameText(EErrorText.Empty("Tên mặt hàng"));
      isError = true;
    } else {
      setErrorNameText("");
    }
    if (!price && Number(price) !== 0) {
      setErrorPriceText(EErrorText.Empty("Giá mặt hàng"));
      isError = true;
    } else if (Number(price) < 0) {
      setErrorPriceText(EErrorText.NumberLessZezo("Giá mặt hàng"));
      isError = true;
    } else {
      setErrorPriceText("");
    }
    if (!quantity && Number(quantity) !== 0) {
      setErrorQuantityText(EErrorText.Empty("Số lượng"));
      isError = true;
    } else if (Number(quantity) < 0) {
      setErrorQuantityText(EErrorText.NumberLessZezo("Số lượng"));
      isError = true;
    } else if (Number(quantity) !== Math.floor(quantity)) {
      setErrorQuantityText(EErrorText.InvalidNumber("Số lượng"));
      isError = true;
    } else {
      setErrorQuantityText("");
    }
    if (!category.name) {
      setErrorCategoryText(EErrorText.Empty("Loại mặt hàng"));
      isError = true;
    } else {
      setErrorCategoryText("");
    }

    if (isError) {
      return isError;
    }

    let newCategory: any = category;

    if (isCreatedNewCategory) {
      const response: any = await axios
        .post(`http://54.199.68.197:8081/api/v1/category`, {
          name: category.name,
        })
        .catch((e) => console.log(e));
      if (response?.status === 200) {
        newCategory = {
          id: response.data.data.id,
        };
      } else {
        setErrorCategoryText("Loại mặt hàng đã tồn tại");
        return true;
      }
    }

    const data: any = {
      name,
      image,
      quantity,
      price,
      description,
      category: { id: newCategory.id },
    };

    if (!id) {
      await axios
        .post(`http://54.199.68.197:8081/api/v1/products`, data)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    } else {
      await axios
        .put(`http://54.199.68.197:8081/api/v1/products/${id}`, data)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    }

    setName(data[1] || "");
    setImage(data[2] || "");
    setPrice(data[4] || 0);
    setQuantity(data[5] || 0);
    setDescription(data[6]);
    setCategory({
      id: data[7] || "",
      name: data[3] || "",
    });
    setErrorNameText("");
    setErrorPriceText("");
    setErrorQuantityText("");
    setErrorCategoryText("");
    setSelectedCategorys([
      {
        id: data[7] || "",
        name: data[3] || "",
        isDeleted: false,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handelSubmit = () => {
    setSaving(true);
    handleSaveProduct()
      .then((isError) => {
        setSaving(false);
        return isError;
      })
      .then((isError) => !isError && closeModal(EModal.MODAL_EDIT_PRODUCT));
  };

  const handleCloseModal = () => {
    if (
      (data?.length &&
        JSON.stringify([
          product?.id,
          product?.name,
          product?.image,
          product?.category.name,
          product?.price,
          product?.quantity,
          product?.description,
          product?.category.id,
        ]) !==
        JSON.stringify([
          id,
          name,
          image,
          category.name,
          price,
          quantity,
          description,
          category.id,
        ])) ||
      (data.length === 0 &&
        (name || image || category.name || price || quantity || description))
    ) {
      openModal(EModal.UNSAVE_CHANGE_PRODUCT, {
        data: [
          id,
          name,
          image,
          category.name,
          price,
          quantity,
          description,
          category.id,
        ],
      });
      closeModal(EModal.MODAL_EDIT_PRODUCT);
    } else {
      closeModal(EModal.MODAL_EDIT_PRODUCT);
    }
  };

  return (
    <Modal
      open={state[EModal.MODAL_EDIT_PRODUCT]?.active}
      title={data.length ? `Chỉnh sửa mặt hàng ${name}` : "Thêm mặt hàng"}
      onClose={handleCloseModal}
      primaryAction={{
        content: "Lưu",
        onAction: handelSubmit,
        loading: saving,
      }}
      loading={isLoading}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: handleCloseModal,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap={"300"}>
          {id && (
            <TextField value={id} disabled autoComplete="true" label="Id" />
          )}
          <TextField
            label="Tên"
            value={name}
            onChange={(v) => setName(v)}
            autoComplete="true"
            requiredIndicator
            autoFocus
            error={errorNameText}
          />
          {image ? (
            <SelectedMediaCard
              filename={name}
              imageUrl={image}
              setImage={setImage}
            />
          ) : (
            <DropZoneImage setImage={setImage} />
          )}
          <BlockStack gap={"200"}>
            <Text as="p" variant="bodyMd">
              Loại mặt hàng
              <span style={{ color: "rgb(142, 31, 11)" }}> *</span>
            </Text>
            <BlockStack align="space-between" gap={"200"}>
              {isCreatedNewCategory ? (
                <TextField
                  label=""
                  value={category.name}
                  onChange={(v: any) =>
                    setCategory((prev) => ({ ...prev, name: v }))
                  }
                  autoComplete="true"
                  requiredIndicator
                  autoFocus
                  error={errorCategoryText}
                />
              ) : (
                <BlockStack>
                  <Box padding={"050"}>
                    <Popover
                      active={isActivePopoverCategory}
                      preferredAlignment="left"
                      preferredPosition="below"
                      activator={
                        <Button
                          onClick={() =>
                            setIsActivePopoverCategory((prev) => !prev)
                          }
                          disclosure
                        >
                          {category.id
                            ? listCategory.find((c) => c.id === category.id)
                              ?.name
                            : "Lọc theo loại mặt hàng"}
                        </Button>
                      }
                      onClose={() =>
                        setIsActivePopoverCategory((prev) => !prev)
                      }
                      ariaHaspopup={false}
                    >
                      <Box padding={"150"} width="240px">
                        <BlockStack gap={"200"}>
                          <TextField
                            onChange={(v) => {
                              setSearchCategory(v);
                            }}
                            label="Search category"
                            labelHidden
                            placeholder="Tìm kiếm theo loại"
                            value={searchCategory}
                            prefix={<Icon source={SearchIcon} tone="base" />}
                            autoComplete="off"
                            clearButton
                            onClearButtonClick={() => {
                              setSearchCategory("");
                            }}
                          />
                          <Scrollable style={{ maxHeight: 300 }}>
                            {listCategory
                              .filter((category) =>
                                category.name
                                  .toLowerCase()
                                  .includes(searchCategory.toLowerCase())
                              )
                              .map((category) => (
                                <CategoryListItem
                                  key={category.id}
                                  category={category}
                                  selectedCategorys={selectedCategorys}
                                  setSelectedCategorys={setSelectedCategorys}
                                  onlyChoice
                                  closePopover={() =>
                                    setIsActivePopoverCategory(false)
                                  }
                                  setCategory={setCategory}
                                />
                              ))}
                          </Scrollable>
                        </BlockStack>
                      </Box>
                    </Popover>
                  </Box>
                  {errorCategoryText && (
                    <div className="Polaris-Labelled__Error">
                      <div id=":r73:Error" className="Polaris-InlineError">
                        <div className="Polaris-InlineError__Icon">
                          <span className="Polaris-Icon">
                            <svg
                              viewBox="0 0 20 20"
                              className="Polaris-Icon__Svg"
                              focusable="false"
                              aria-hidden="true"
                            >
                              <path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path>
                              <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                              <path
                                fill-rule="evenodd"
                                d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        Loại mặt hàng không được để trống.
                      </div>
                    </div>
                  )}
                </BlockStack>
              )}

              <Button onClick={() => setIsCreateNewCategory((prev) => !prev)}>
                {isCreatedNewCategory
                  ? "Huỷ thêm mới"
                  : "Thêm mới loại mặt hàng"}
              </Button>
            </BlockStack>
          </BlockStack>

          <TextField
            label="Giá niêm yết"
            value={price}
            onChange={(v) => setPrice(v)}
            autoComplete="true"
            type="number"
            requiredIndicator
            error={errorPriceText}
          />
          <TextField
            label="Số lượng còn lại"
            value={quantity}
            onChange={(v) => setQuantity(v)}
            type="number"
            requiredIndicator
            autoComplete="true"
            error={errorQuantityText}
          />
          <TextField
            label="Mô tả"
            value={description}
            onChange={(v) => setDescription(v)}
            autoComplete="true"
          />
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalEditProduct;
