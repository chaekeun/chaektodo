import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

function EditModal({ taskId, title, content, onClickCancle }) {
  const [inputTitle, setInputTitle] = useState(title);
  const [inputContent, setInputContent] = useState(content);

  const handleTitle = (e) => {
    setInputTitle(e.target.value);
  };
  const handleContent = (e) => {
    setInputContent(e.target.value);
  };

  return (
    <Modal.Dialog>
      <div className="contaianer edit">
        <form action="/api/edit" method="POST">
          <input
            type="text"
            value={taskId}
            style={{ display: "none" }}
            name="taskId"
          />
          <label>title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={inputTitle}
            onChange={handleTitle}
          />
          <label>content</label>
          <input
            type="text"
            className="form-control"
            name="content"
            value={inputContent}
            onChange={handleContent}
          />

          <button onClick={onClickCancle}>Close Modal</button>
          <button type="submit" className="btn btn-outline-secondary">
            Update
          </button>
        </form>
      </div>
    </Modal.Dialog>
  );
}

export default EditModal;
