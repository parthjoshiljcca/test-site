import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Servlet 2: receives the submitted form (POST /info) and shows the values
public class PersonalInfo extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        String name  = request.getParameter("name");
        String email = request.getParameter("emailId");
        String city  = request.getParameter("city");
        String state = request.getParameter("state");
        String zip   = request.getParameter("zip");

        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>");
            out.println("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css'>");
            out.println("<title>Servlet Lab</title></head><body><div class='container'>");
            out.println("<h1 class='text-center'>Personal Information</h1>");
            out.println("<table class='table'>");
            out.println("<tr><th>Name</th><td>"  + name  + "</td></tr>");
            out.println("<tr><th>Email</th><td>" + email + "</td></tr>");
            out.println("<tr><th>City</th><td>"  + city  + "</td></tr>");
            out.println("<tr><th>State</th><td>" + state + "</td></tr>");
            out.println("<tr><th>Zip</th><td>"   + zip   + "</td></tr>");
            out.println("</table></div></body></html>");
        }
    }
}
