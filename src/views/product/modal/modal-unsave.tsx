import { BlockStack, Text, Modal } from "@shopify/polaris";
import { useModal } from "../../../hook/useModal";
import { EModal } from "../../../constants";

const ModalUnsave = () => {
  const { state, closeModal, openModal } = useModal();
  const data = state[EModal.UNSAVE_CHANGE_PRODUCT]?.data || [];

  const handleCloseModal = () => {
    closeModal(EModal.UNSAVE_CHANGE_PRODUCT);
  };

  return (
    <Modal
      open={state[EModal.UNSAVE_CHANGE_PRODUCT]?.active}
      title="Huỷ thay đổi"
      onClose={handleCloseModal}
      primaryAction={{
        content: "Xác nhận",
        onAction: () => {
          closeModal(EModal.MODAL_EDIT_PRODUCT);
          handleCloseModal();
        },
      }}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: () => {
            handleCloseModal();
            openModal(EModal.MODAL_EDIT_PRODUCT, { data });
          },
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap={"300"}>
          <Text as="p" variant="bodyMd">
            Các thay đổi chưa được lưu.
          </Text>
          <Text as="p" variant="bodyMd">
            Xác nhận huỷ thay đổi?
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalUnsave;
