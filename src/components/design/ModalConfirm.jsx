import React, { useState } from "react";
import { Modal, Button } from "@mui/material";
import Typography from "@mui/material/Typography";

const ModalConfirm = ({ isOpen, actionName, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "#f5f5f5",
          boxShadow: 24,
          p: 4,
          borderRadius: 10, // Rounded corners
          padding: 20,
        }}
      >
        <Typography
          variant="h6"
          id="modal-title"
          style={{ fontSize: "20px", fontFamily: "Lora" }}
        >
          Confirmation
        </Typography>
        <p id="modal-content" style={{ fontSize: "16px", fontFamily: "Lora" }}>
          Are you sure you want to {actionName.toLowerCase()}?
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              backgroundColor: "#008DDA", // Blue color
              color: "white",
              padding: "10px 20px",
              borderRadius: 8, // Rounded corners
              border: "none", // Remove border
              cursor: "pointer", // Indicate clickable element
              marginRight: 10, // Margin between buttons
            }}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            style={{
              backgroundColor: "#CA4E79", // Red color
              color: "white",
              padding: "10px 20px",
              borderRadius: 8, // Rounded corners
              border: "none", // Remove border
              cursor: "pointer", // Indicate clickable element
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
