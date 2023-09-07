import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Write(timer) {
  let navigate = useNavigate();
  // console.log(timer.timer);
  return (
    <div>
      <h4 className="container mt-4">
        <strong>Add your Task!</strong>
      </h4>

      <div className="container mt-3">
        <form action="/api/add" method="POST">
          <div class="form-group">
            <label>title</label>
            <input type="text" className="form-control" name="title" />
            <label>content</label>
            <input type="text" className="form-control" name="content" />
            <input
              type="text"
              value={timer.timer}
              style={{ display: "none" }}
              name="created_at"
            />
          </div>

          <button type="submit" className="btn btn-outline-secondary">
            Submit
          </button>
        </form>{" "}
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancle
        </button>
      </div>
    </div>
  );
}

export default Write;
