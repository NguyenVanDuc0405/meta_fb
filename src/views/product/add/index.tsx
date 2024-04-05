import { Button, ButtonGroup, Card, TextField } from "@mui/material";
import React, { useState } from "react";

const AddProduct = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleAddProduct = async () => {
    // do ADD

    window.location.href = "/product/3";
  };

  return (
    <Card
      style={{ display: "flex", padding: 20, flexDirection: "column", gap: 16 }}
    >
      <TextField
        id="outlined-uncontrolled"
        label="Id"
        defaultValue="3"
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
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
      />
      <TextField
        id="outlined-uncontrolled"
        label="Price"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
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
        <Button color="primary" onClick={handleAddProduct}>
          Add
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default AddProduct;
