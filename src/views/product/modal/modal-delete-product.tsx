import { BlockStack, Text, Modal } from "@shopify/polaris";
import { useModal } from "../../../hook/useModal";
import { EModal } from "../../../constants";
import { useState } from "react";
import axios from "axios";

const ModalDeleteProduct = ({
  selectedRows = [],
  setSelectedRows = () => {},
  type
}: {
  selectedRows: number[];
  setSelectedRows: Function;
  type: string;
}) => {
  const { state, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct = async (id: number) => {
    await axios
      .delete(`http://54.199.68.197:8081/api/v1/${type}/${id}`)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));

    setSelectedRows([]);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    selectedRows.forEach((id: number, index: number) => {
      handleDeleteProduct(id).then(() => {
        if (index === selectedRows.length - 1) {
          setIsLoading(false);
          handleCloseModal();
        }
      });
    });
  };

  const handleCloseModal = () => {
    closeModal(EModal.MODAL_DELETE_PRODUCT);
  };

  return (
    <Modal
      open={state[EModal.MODAL_DELETE_PRODUCT]?.active}
      title={`Xác nhận xoá ${selectedRows.length} mặt hàng`}
      onClose={handleCloseModal}
      primaryAction={{
        content: "Xác nhận",
        onAction: handleSubmit,
        loading: isLoading,
      }}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: () => {
            handleCloseModal();
          },
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap={"300"}>
          <Text as="p" variant="bodyMd">
            Mặt hàng đã xoá sẽ không thể khôi phục lại.
          </Text>
          <Text as="p" variant="bodyMd">
            Tiếp tục xoá?
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalDeleteProduct;
