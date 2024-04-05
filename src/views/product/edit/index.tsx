import { Button, ButtonGroup, Card, TextField } from "@mui/material";
import React, { useState } from "react";

const EditProduct = () => {
  const product = {
    id: 3,
    url: "https://example.com/product/3",
    name: "Product 3",
    quantity: 10,
    price: 100,
    description: "This is product 3",
    category: "Product",
  };

  const [url, setUrl] = useState(product.url);
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);

  // const handleEditProduct = async () => {
  //   // do ADD

  //   window.location.href = "/products";
  // };

  const handleDeleteProduct = async () => {
    // do DELETE

    window.location.href = "/products";
  };

  return (
    <Card
      style={{ display: "flex", padding: 20, flexDirection: "column", gap: 16 }}
    >
      <TextField
        id="outlined-uncontrolled"
        label="Id"
        value={product.id}
        disabled
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Quantity"
        required
        value={quantity}
        onChange={(e) =>
          typeof e.target.value === "number" && setQuantity(e.target.value)
        }
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Price"
        required
        value={price}
        onChange={(e) =>
          typeof e.target.value === "number" && setPrice(e.target.value)
        }
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Category"
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
      />
      <ButtonGroup>
        <Button
          color="secondary"
          onClick={() => (window.location.href = "/products")}
        >
          Cancel
        </Button>
        <Button color="error" onClick={handleDeleteProduct}>
          Delete
        </Button>
        <Button color="primary">Save</Button>
      </ButtonGroup>
    </Card>
  );
};

export default EditProduct;
