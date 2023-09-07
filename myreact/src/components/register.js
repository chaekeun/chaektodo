function Register() {
  return (
    <div>
      <h4 class="container mt-4">
        <strong>SignIn</strong>
      </h4>

      <div className="container mt-4">
        <form action="/api/signin" method="POST">
          <div class="form-group">
            <label>id</label>
            <input type="text" className="form-control" name="userid" />
            <label>pw</label>
            <input type="password" className="form-control" name="userpw" />
          </div>
          <button type="submit" className="btn btn-outline-secondary">
            Submit
          </button>
        </form>
      </div>
      <h4 class="container mt-4">
        <strong>SignUp</strong>
      </h4>
      <div className="container mt-4">
        <form action="/api/signup" method="POST">
          <div class="form-group">
            <label>username</label>
            <input type="text" className="form-control" name="username" />
            <label>id</label>
            <input type="text" className="form-control" name="userid" />
            <label>pw</label>
            <input type="password" className="form-control" name="userpw" />
          </div>
          <button type="submit" className="btn btn-outline-secondary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
