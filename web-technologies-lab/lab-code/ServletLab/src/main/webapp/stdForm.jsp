<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
  <title>JSP Project</title>
</head>
<body>
<div class="container">
  <h1 class="text-center">Personal Information Form</h1>
  <form class="row g-3" action="studentView.jsp" method="post">
    <div class="col-12">
      <label class="form-label">Name</label>
      <input type="text" name="name" class="form-control">
    </div>
    <div class="col-md-6">
      <label class="form-label">Email</label>
      <input type="email" name="emailId" class="form-control">
    </div>
    <div class="col-md-6">
      <label class="form-label">City</label>
      <input type="text" name="city" class="form-control">
    </div>
    <div class="col-md-4">
      <label class="form-label">State</label>
      <select name="state" class="form-select">
        <option value="Delhi" selected>Delhi</option>
        <option value="Bihar">Bihar</option>
        <option value="UP">UP</option>
      </select>
    </div>
    <div class="col-md-2">
      <label class="form-label">Zip</label>
      <input type="text" name="zipCode" class="form-control">
    </div>
    <div class="col-12 text-center">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</div>
</body>
</html>
