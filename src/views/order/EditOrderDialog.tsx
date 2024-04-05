import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  Select,
  DataTable,
  FormLayout,
  Grid,
  TableData,
  ButtonGroup,
  Text,
  Box,
  Thumbnail,
  InlineStack,
} from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import moment from "moment";
import axios from "axios";
import AddOrderProductDialog from "./AddOrderProductDialog";
import { Order, OrderProduct, Supplier } from "../../interface";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: Order;
  fetchData: () => void;
  setSelectedRows: Function;
}

const EditOrderDialog: React.FC<Props> = ({
  open,
  setOpen,
  order,
  fetchData,
  setSelectedRows,
}) => {
  const [taxType, setTaxType] = useState<string>("5");
  const [showErr, setShowErr] = useState<boolean>(false);
  const [showCodeErr, setShowCodeErr] = useState<boolean>(false);
  const [showSupllierErr, setShowSupplierErr] = useState<boolean>(false);
  const [listSupplier, setListSupplier] = useState<Supplier[]>([]);
  const [totalPrice, setTotalPrice] = useState<number | undefined>(0);
  const [addProductDialog, setAddProductDialog] = useState<boolean>(false);
  const [orderProduct, setOrderProduct] = useState<OrderProduct>();
  const [orderData, setOrderData] = useState<Order>(
    order || {
      createdAt: moment().format("YYYY-MM-DD"),
      status: false,
      supplier: { id: 0, name: "" },
      orderProducts: [],
      tax: 0.05,
      note: "",
      code: "",
    }
  );
  const [supplier, setSupplier] = useState<string>(
    order?.supplier?.id.toString()
  );

  useEffect(() => {
    const fetchSupplierData = async () => {
      const response = await axios.get(
        "http://54.199.68.197:8081/api/v1/suppliers",
        {
          params: {
            page: 0,
            size: 100,
          },
        }
      );
      setListSupplier(response?.data?.data?.data);
    };
    fetchSupplierData();
  }, []);

  useEffect(() => {
    setTotalPrice(calcTotalPrice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData]);

  const convertDataToRow = (tableData: Order | undefined): TableData[][] => {
    if (!tableData || !tableData.orderProducts) return [];

    return tableData.orderProducts.map((item: OrderProduct) => [
      <Box id="product-name-and-image">
        <Text id="product-name" as="p">
          {item.product.name}
        </Text>
        <Thumbnail source={item.product.image} alt="image" />
      </Box>,
      <div style={{ textAlign: "center" }}>{item.quantity}</div>,
      item.product.category.name,
      item.product.price,
      item.product.price * item.quantity,
      <div style={{ minWidth: "70px" }}>
        <ButtonGroup>
          <Button
            icon={EditIcon}
            onClick={() => handleClickEdit(item)}
            id="edit-order-product-btn"
            disabled={orderData?.status}
          />
          <Button
            icon={DeleteIcon}
            tone="critical"
            onClick={() => handleClickDelete(item)}
            id="delete-order-product-btn"
            disabled={orderData?.status}
          />
        </ButtonGroup>
      </div>,
    ]);
  };

  const calcTotalPrice = (): number | undefined => {
    return orderData?.orderProducts?.reduce(
      (store: number, item: OrderProduct) =>
        store + item.quantity * item.product.price,
      0
    );
  };

  const handleChangeNote = (value: string) => {
    if (value.length <= 500) {
      setOrderData({ ...orderData, note: value });
    }
  };

  const handleChangeSupplier = (value: string) => {
    setSupplier(value as string);
    setOrderData({ ...orderData, supplier: { id: value, name: "" } });
  };

  const handleUpdateItem = (data: OrderProduct, id: number) => {
    if (data?.product && data?.quantity) {
      setShowErr(false);
      setAddProductDialog(false);
      let isExist = false;
      const newOrderProducts = orderData?.orderProducts?.map(
        (item: OrderProduct) => {
          if (item.product.id === data.product.id || item.id === id) {
            isExist = true;
            return data;
          }
          return item;
        }
      );

      setOrderData({
        ...orderData,
        orderProducts:
          id || isExist
            ? newOrderProducts
            : orderData
              ? [...(orderData?.orderProducts as Array<OrderProduct>), data]
              : [data],
      });
    } else {
      alert("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleClickDelete = (item: OrderProduct) => {
    if (orderData && orderData.orderProducts) {
      setOrderData({
        ...orderData,
        orderProducts: orderData.orderProducts.filter(
          (product: OrderProduct) => item.id !== product.id
        ),
      });
    }
  };

  const handleClickEdit = (item: OrderProduct) => {
    setOrderProduct(item);
    setAddProductDialog(true);
  };

  const validate = (): boolean => {
    let check = true;
    if (orderData?.orderProducts?.length === 0) {
      setShowErr(true);
      check = false;
    }

    if (orderData?.code.length === 0) {
      setShowCodeErr(true);
      check = false;
    }

    if (!orderData?.supplier?.id) {
      setShowSupplierErr(true);
      check = false;
    }
    return check;
  }

  const handleSubmit = async () => {
    if(!validate()) return;

    const newData = orderData?.orderProducts?.map((product: OrderProduct) => {
      return {
        id: product.product.id,
        quantity: product.quantity,
      };
    });

    if (order?.id) {
      try {
        await axios.put(
          `http://54.199.68.197:8081/api/v1/orders/${order.id}`,
          {
            code: orderData?.code,
            note: orderData?.note,
            taxType: orderData?.tax,
            supplier: {
              id: orderData?.supplier?.id,
            },
            products: newData,
          },
          {
            params: {
              page: 0,
              size: 1000,
            },
          }
        );
        fetchData();
        setOpen(false);
        setSelectedRows([]);
      } catch (e: any) {
        alert(e.response.data.message);
      }
    } else {
      const sendData = {
        ...orderData,
        supplier: {
          id: orderData?.supplier.id,
        },
        products: (orderData.orderProducts as Array<OrderProduct>).map(
          (item: OrderProduct) => {
            return {
              id: item.product.id,
              quantity: item.quantity,
            };
          }
        ),
        status: false,
      };
      try {
        const response = await axios.post(
          "http://54.199.68.197:8081/api/v1/orders",
          sendData
        );
        if (response?.data?.status === 200) {
          fetchData();
          setOpen(false);
        }
      } catch (e: any) {
        alert(e.response.data.message);
      }
    }
  };

  return (
    <div>
      {addProductDialog && (
        <AddOrderProductDialog
          handleUpdateItem={handleUpdateItem}
          data={orderProduct as OrderProduct}
          open={addProductDialog}
          setOpen={setAddProductDialog}
        />
      )}
      <Modal
        size="large"
        title={order?.id ? "Sửa thông tin đơn hàng" : "Tạo đơn nhập hàng"}
        open={open}
        onClose={() => setOpen(false)}
        primaryAction={{
          content: orderData?.status ? "Đơn hàng đã thanh toán" : "Lưu",
          onAction: handleSubmit,
          disabled: orderData?.status
        }}
        secondaryActions={[
          {
            content: "Hủy",
            onAction: () => setOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Grid>
            <Grid.Cell columnSpan={{ lg: 8, md: 4, xs: 6 }}>
              <FormLayout>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6 }}>
                    <TextField
                      label="Ngày tạo đơn"
                      type="date"
                      value={moment(orderData?.createdAt).format("YYYY-MM-DD")}
                      disabled
                      autoComplete="off"
                      id="order-date"
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6 }}>
                    <TextField
                      label="Mã vận đơn"
                      type="text"
                      value={orderData?.code}
                      onChange={(e) => {
                        setOrderData({ ...orderData, code: e });
                        setShowCodeErr(false);
                      }}
                      autoComplete="off"
                      id="delivery-code"
                      disabled={orderData?.status}
                      requiredIndicator
                    />
                    {showCodeErr && <Text tone="critical" as="p">Vui lòng nhập mã vận đơn</Text>}
                  </Grid.Cell>
                </Grid>
                <div>
                  <Select
                    disabled={orderData?.status}
                    id="supplier-select"
                    label="Nhà cung cấp"
                    options={listSupplier.map((item: Supplier) => {
                      return {
                        label: item.name || "",
                        value: item.id.toString(),
                      };
                    })}
                    value={supplier}
                    onChange={(value) => {
                      handleChangeSupplier(value);
                      setShowSupplierErr(false);
                    }}
                    placeholder="Chọn nhà cung cấp"
                    requiredIndicator
                  />
                  {showSupllierErr && <Text tone="critical" as="p">Vui lòng chọn nhà cung cấp</Text>}
                </div>
                <TextField
                  id="note"
                  label="Ghi chú"
                  value={orderData?.note}
                  onChange={handleChangeNote}
                  multiline={3}
                  autoComplete="off"
                  maxLength={200}
                  showCharacterCount
                  disabled={orderData?.status}
                />
              </FormLayout>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, md: 2, lg: 4 }}>
              <div style={{ marginBottom: "15px" }}>
                <TextField
                  id="total-product-price"
                  label="Tổng tiền hàng hoá"
                  value={totalPrice?.toString()}
                  disabled
                  autoComplete=""
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <Select
                  id="tax-select"
                  label="Chọn mức thuế"
                  value={taxType}
                  options={[
                    {
                      label: "5%",
                      value: "0.05",
                    },
                    {
                      label: "10%",
                      value: "0.1",
                    },
                  ]}
                  onChange={(e) => setTaxType(e)}
                  disabled={orderData?.status}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <TextField
                  id="tax"
                  label="Giá trị thuế"
                  value={
                    totalPrice
                      ? (parseFloat(taxType) * totalPrice).toString()
                      : "0"
                  }
                  autoComplete=""
                />
              </div>
              <TextField
                id="total"
                label="Tổng hóa đơn"
                value={
                  totalPrice
                    ? (parseFloat(taxType) * totalPrice + totalPrice).toString()
                    : "0"
                }
                disabled
                autoComplete=""
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 12 }}>
              <InlineStack gap="400">
                <Button
                  disabled={orderData?.status}
                  onClick={() => {
                    setAddProductDialog(true);
                    setOrderProduct(undefined);
                  }}
                  id="add-order-product-btn"
                >
                  Thêm mặt hàng
                </Button>
                {showErr && <Text tone="critical" as="p">Vui lòng nhập sản phẩm</Text>}
              </InlineStack>
              <DataTable
                columnContentTypes={[
                  "text",
                  "numeric",
                  "text",
                  "numeric",
                  "numeric",
                  "text",
                ]}
                headings={[
                  "Tên mặt hàng",
                  <div style={{ textAlign: "center" }}>Số lượng</div>,
                  "Loại",
                  "Giá",
                  "Tổng tiền",
                  "Thao tác",
                ]}
                rows={convertDataToRow(orderData)}
              />
            </Grid.Cell>
          </Grid>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default EditOrderDialog;
