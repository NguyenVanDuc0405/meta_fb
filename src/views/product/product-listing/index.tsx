import {
  BlockStack,
  Box,
  Button,
  Checkbox,
  DataTable,
  Icon,
  InlineStack,
  Page,
  Popover,
  Scrollable,
  TableData,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category, Product } from "../../../interface";
import { CategoryListItem } from "../CategoryListItem";
import { useModal } from "../../../hook/useModal";
import { EModal } from "../../../constants";
import ModalEditProduct from "../modal/modal-edit-product";
import ModalUnsave from "../modal/modal-unsave";
import ModalDeleteProduct from "../modal/modal-delete-product";
import { useDocument } from "../../../hook/useDocument";

const defaultTable: {
  heading: string;
  type: "text" | "numeric";
  sortable: boolean;
}[] = [
    { heading: "", type: "text", sortable: false },
    { heading: "Id", type: "text", sortable: true },
    { heading: "Tên mặt hàng", type: "text", sortable: true },
    { heading: "Hình ảnh", type: "text", sortable: false },
    { heading: "Loại", type: "text", sortable: false },
    { heading: "Giá niêm yết", type: "numeric", sortable: true },
    { heading: "Số lượng còn lại", type: "numeric", sortable: true },
    { heading: "Mô tả", type: "text", sortable: false },
  ];

const formatToDataTable = (products: Product[]): TableData[][] => {
  return products
    .filter(({ isDeleted }) => !isDeleted)
    .map(
      ({
        id,
        name,
        image,
        category: { name: categoryListName, id: categoryId },
        price,
        quantity,
        description,
      }) => {
        return [
          id,
          name,
          image,
          categoryListName,
          price,
          quantity,
          description,
          categoryId,
        ];
      }
    );
};

const formatToTableRow = (
  tableData: TableData[][],
  selectedRows: any,
  setSelectedRows: (prev: any) => void
) => {
  return tableData.map((row, index) => {
    const [id, name, image, categoryListName, price, quantity, description] =
      row;
    return [
      <Checkbox
        name=""
        value=""
        label=""
        labelHidden
        checked={selectedRows.find((rowId: any) => rowId === id)}
        onChange={(v: boolean) => {
          !v
            ? setSelectedRows((prev: any) =>
              prev.filter((rowId: any) => rowId !== id)
            )
            : setSelectedRows((prev: any) => [...prev, id]);
        }}
      />,
      id,
      <Text as="h4" variant="bodyLg">
        {name}
      </Text>,
      <Thumbnail source={image as string} alt={name as string} size="large" />,
      categoryListName,
      price,
      quantity,
      description,
    ];
  });
};

const ProductsListing = () => {
  const navigate = useNavigate();
  const { openModal, state: stateModal } = useModal();
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [sortedRows, setSortedRows] = useState<TableData[][]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [activePopover, setActivePopover] = useState(false);
  const [selectedCategorys, setSelectedCategorys] = useState<Category[]>([]);
  const [searchCategory, setSearchCategory] = useState("");

  useDocument("Quản lý mặt hàng");

  const filteredListCategory = listCategory.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  useEffect(() => {
    axios
      .get("http://54.199.68.197:8081/api/v1/products?page=0&size=10000")
      .then((res) => {
        if (res.status === 200)
          setSortedRows(
            sortTable(
              formatToDataTable(res?.data?.data?.data || []),
              0,
              "ascending"
            )
          );
      })
      .catch((e) => console.error(e));

    axios
      .get("http://54.199.68.197:8081/api/v1/category")
      .then((res) => {
        if (res.status === 200) setListCategory(res?.data?.data?.data || []);
      })
      .catch((e) => console.error(e));
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stateModal[EModal.MODAL_EDIT_PRODUCT]?.active,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stateModal[EModal.MODAL_DELETE_PRODUCT]?.active,
  ]);

  const handleSort = (index: number, direction: "ascending" | "descending") =>
    sortedRows?.length &&
    setSortedRows(sortTable(sortedRows, index, direction));

  const filteredRows = sortedRows.filter((row) => {
    return (
      row[1]?.toString().toLowerCase().includes(searchProduct.toLowerCase()) &&
      (selectedCategorys.length
        ? selectedCategorys.find((category) => category.id === Number(row[7]))
        : true)
    );
  });

  useEffect(() => {
    const rows: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".Polaris-DataTable__TableRow"
    );

    rows.forEach((row, index) => {
      row.style.cursor = "pointer";

      row.onclick = (e) => {
        if (
          (e.target as any)?.classList[0] === "Polaris-Checkbox__Input" ||
          (e.target as any)?.classList[0] === "Polaris-Checkbox__Backdrop"
        ) {
        } else {
          setSelectedRows((prev: number[]) =>
            prev.find((rowId: any) => rowId === filteredRows[index][0])
              ? prev.filter(
                (rowId: any) => rowId !== Number(filteredRows[index][0])
              )
              : [...prev, Number(filteredRows[index][0])]
          );
        }
      };

      row.ondblclick = (e) => {
        e.preventDefault();

        openModal(EModal.MODAL_EDIT_PRODUCT, { data: filteredRows[index] });
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRows, selectedRows]);

  return (
    <Page
      fullWidth
      title="Quản lý mặt hàng"
      backAction={{
        onAction: () => navigate("/"),
      }}
      primaryAction={{
        content: "Thêm mặt hàng",
        onAction: () => openModal(EModal.MODAL_EDIT_PRODUCT),
      }}
    >
      <BlockStack gap={"400"}>
        <InlineStack gap={"400"} blockAlign="center">
          <TextField
            labelHidden
            label=""
            value={searchProduct}
            onChange={(v) => setSearchProduct(v)}
            onClearButtonClick={() => setSearchProduct("")}
            placeholder="Tìm kiếm mặt hàng..."
            autoComplete=""
            clearButton
          />
          <Box padding={"200"}>
            <Popover
              active={activePopover}
              preferredAlignment="left"
              preferredPosition="below"
              activator={
                <Button
                  onClick={() => setActivePopover((prev) => !prev)}
                  disclosure
                >
                  Lọc theo loại mặt hàng
                </Button>
              }
              onClose={() => setActivePopover((prev) => !prev)}
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
                    {filteredListCategory.map((category) => (
                      <CategoryListItem
                        key={category.id}
                        category={category}
                        selectedCategorys={selectedCategorys}
                        setSelectedCategorys={setSelectedCategorys}
                      />
                    ))}
                  </Scrollable>
                </BlockStack>
              </Box>
            </Popover>
          </Box>

          <Button
            onClick={() => setSelectedRows([])}
            disabled={!selectedRows.length}
          >
            Bỏ chọn
          </Button>
        </InlineStack>

        <Box position="relative">
          <DataTable
            headings={defaultTable.map(({ heading }) => heading)}
            columnContentTypes={defaultTable.map(({ type }) => type)}
            sortable={defaultTable.map(({ sortable }) => sortable)}
            rows={formatToTableRow(filteredRows, selectedRows, setSelectedRows)}
            fixedFirstColumns={0}
            firstColumnMinWidth="500px"
            truncate
            verticalAlign="middle"
            hoverable
            stickyHeader
            onSort={handleSort}
            defaultSortDirection="ascending"
            initialSortColumnIndex={0}
          />
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
                onClick={() =>
                  openModal(EModal.MODAL_EDIT_PRODUCT, {
                    data: sortedRows.find((row) => row[0] === selectedRows[0]),
                  })
                }
              >
                Sửa mặt hàng
              </Button>
              <Button
                variant="primary"
                tone="critical"
                onClick={() =>
                  openModal(EModal.MODAL_DELETE_PRODUCT, {
                    data: { selectedRows, setSelectedRows },
                  })
                }
              >
                Xoá mặt hàng
              </Button>
            </div>
          )}
        </Box>
      </BlockStack>
      <ModalEditProduct />
      <ModalDeleteProduct
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        type={"products"}
      />
      <ModalUnsave />
    </Page>
  );
};

export default ProductsListing;

const sortTable = (
  rows: TableData[][],
  index: number,
  direction: "ascending" | "descending"
) => {
  switch (index) {
    case 1: {
      return [...rows].sort((a: any, b: any) => {
        return direction === "ascending"
          ? Number(a[0]) - Number(b[0])
          : Number(b[0]) - Number(a[0]);
      });
    }

    case 2: {
      return [...rows].sort((a: any, b: any) => {
        return direction === "ascending"
          ? a[1]
            ?.toString()
            .toLowerCase()
            .localeCompare(b[1]?.toString().toLowerCase())
          : b[1]
            ?.toString()
            .toLowerCase()
            .localeCompare(a[1]?.toString().toLowerCase());
      });
    }

    case 5: {
      return [...rows].sort((a: any, b: any) => {
        return direction === "ascending"
          ? Number(a[4]) - Number(b[4])
          : Number(b[4]) - Number(a[4]);
      });
    }

    case 6: {
      return [...rows].sort((a: any, b: any) => {
        return direction === "ascending"
          ? Number(a[5]) - Number(b[5])
          : Number(b[5]) - Number(a[5]);
      });
    }

    default: {
      return rows;
    }
  }
};
