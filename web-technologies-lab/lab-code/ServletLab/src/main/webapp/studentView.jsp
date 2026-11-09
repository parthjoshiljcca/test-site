<%@page import="java.util.Date"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
  <title>JSP Project: View Personal Info</title>
</head>
<body>
<div class="container">
  <h1 class="text-center">Personal Information</h1>
  <table class="table">
    <tr><th>Name:</th>       <td><%= request.getParameter("name") %></td></tr>
    <tr><th>Email Id:</th>   <td><%= request.getParameter("emailId") %></td></tr>
    <tr><th>City:</th>       <td><%= request.getParameter("city") %></td></tr>
    <tr><th>State:</th>      <td><%= request.getParameter("state") %></td></tr>
    <tr><th>Zip Code:</th>   <td><%= request.getParameter("zipCode") %></td></tr>
    <tr><th>Entry Date:</th> <td><%= new Date() %></td></tr>
    <tr><th>IP Address:</th> <td><%= request.getRemoteAddr() %></td></tr>
  </table>
</div>
</body>
</html>
