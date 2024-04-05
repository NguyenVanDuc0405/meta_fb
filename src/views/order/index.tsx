import React, { useEffect, useState } from "react";
import {
  Page,
  Card,
  DataTable,
  Button,
  ButtonGroup,
  Checkbox,
} from "@shopify/polaris";
import axios from "axios";
import moment from "moment";
import { Order } from "../../interface";
import EditOrderDialog from "./EditOrderDialog";
import { useNavigate } from "react-router-dom";
import ModalDeleteProduct from "../product/modal/modal-delete-product";
import { useModal } from "../../hook/useModal";
import { EModal } from "../../constants";
import { useDocument } from "../../hook/useDocument";

const OrdersPage = () => {
  const { openModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Array<Order>>([]);
  const [displayOrders, setDisplayOrders] = useState<Array<Order>>([]);
  const [order, setOrder] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 10;

  useDocument("Quản lý đơn nhập hàng");

  const navigate = useNavigate();

  const headings = [
    "",
    <div style={{ textAlign: "center" }}>STT</div>,
    <div style={{ textAlign: "center" }}>Mã đơn hàng</div>,
    <div style={{ textAlign: "left" }}>Ngày tạo</div>,
    <div style={{ textAlign: "left" }}>Nhà cung cấp</div>,
    <div style={{ textAlign: "left" }}>Trạng thái</div>,
  ];

  const formatToRowData = (data: Order[]) => {
    return data.map((item: Order, index: number) => [
      <Checkbox
        name=""
        value=""
        label=""
        labelHidden
        checked={
          selectedRows.find((rowId: any) => rowId === item.id) ? true : false
        }
        onChange={(v: boolean) => {
          !v
            ? setSelectedRows((prev: any) =>
              prev.filter((rowId: any) => rowId !== item.id)
            )
            : setSelectedRows((prev: any) => [...prev, item.id]);
        }}
      />,
      <div style={{ textAlign: "center" }}>
        {page * itemsPerPage + index + 1}
      </div>,
      <div style={{ textAlign: "center" }}>{item.id}</div>,
      moment(item.createdAt).format("YYYY-MM-DD"),
      item.supplier.name,
      item.status ? "Đã thanh toán" : "Chưa thanh toán",
    ]);
  };

  const fetchData = () => {
    axios
      .get("http://54.199.68.197:8081/api/v1/orders", {
        params: { page: 0, size: 10000 },
      })
      .then((res) => {
        if (res.status === 200) {
          const orderList = res?.data?.data?.data;
          setItems(orderList);
          setDisplayOrders(orderList.slice(0, itemsPerPage));
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchData();
  }, [open, page, selectedRows]);

  const handleAddItem = () => {
    setOrder(undefined);
    setOpen(true);
  };

  const handleEditItem = () => {
    const item = items.find((item) => item.id === selectedRows[0]);
    setOrder(item);
    setOpen(true);
  };

  const handleChangePage = (event: number) => {
    const newPage = page + event;
    setPage(newPage);
    setDisplayOrders(
      items.slice(newPage * itemsPerPage, (newPage + 1) * itemsPerPage)
    );
  };

  return (
    <Page
      backAction={{
        onAction: () => navigate("/"),
      }}
      title="Quản lý đơn hàng"
      primaryAction={{
        content: "Tạo đơn hàng",
        onAction: () => handleAddItem(),
      }}
      fullWidth
    >
      <div style={{ marginBottom: "20px" }}>
        <Button
          onClick={() => setSelectedRows([])}
          disabled={!selectedRows.length}
        >
          Bỏ chọn
        </Button>
      </div>
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={headings}
          rows={formatToRowData(displayOrders)}
          truncate
        />
      </Card>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <ButtonGroup>
          <Button
            disabled={page === 0}
            onClick={() => handleChangePage(-1)}
            id="previous-page"
          >
            Trang trước
          </Button>
          <Button
            disabled={items.length < itemsPerPage * (page + 1)}
            onClick={() => handleChangePage(1)}
            id="next-page"
          >
            Trang tiếp theo
          </Button>
        </ButtonGroup>
      </div>
      {selectedRows.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "15px",
            background: "#fff",
            paddingBlock: 8,
            paddingInline: 12,
            borderRadius: 8,
            border: "1px solid #f1f1f1",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
          }}
        >
          <Button
            variant="primary"
            disabled={selectedRows.length > 1}
            onClick={handleEditItem}
          >
            Sửa đơn hàng
          </Button>
          <Button
            variant="primary"
            tone="critical"
            onClick={() => {
              openModal(EModal.MODAL_DELETE_PRODUCT, {
                data: { selectedRows, setSelectedRows },
              });
            }}
          >
            Xoá đơn hàng
          </Button>
        </div>
      )}
      {open && (
        <EditOrderDialog
          order={order}
          open={open}
          setOpen={setOpen}
          fetchData={fetchData}
          setSelectedRows={setSelectedRows}
        />
      )}
      <ModalDeleteProduct
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        type={"orders"}
      />
    </Page>
  );
};

export default OrdersPage;
