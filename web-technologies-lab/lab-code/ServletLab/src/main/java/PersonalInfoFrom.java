import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Servlet 1: sends the HTML form to the browser
public class PersonalInfoFrom extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>");
            out.println("<meta name='viewport' content='width=device-width, initial-scale=1'>");
            out.println("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css'>");
            out.println("<title>Servlet Lab</title></head><body><div class='container'>");
            out.println("<h1 class='text-center'>Personal Information Form</h1>");
            out.println("<form class='row g-3' action='info' method='post'>");
            out.println(" <div class='col-12'><label class='form-label'>Name</label>"
                      + "<input type='text' name='name' class='form-control'></div>");
            out.println(" <div class='col-md-6'><label class='form-label'>Email</label>"
                      + "<input type='email' name='emailId' class='form-control'></div>");
            out.println(" <div class='col-md-6'><label class='form-label'>Password</label>"
                      + "<input type='password' name='pwd' class='form-control'></div>");
            out.println(" <div class='col-md-6'><label class='form-label'>City</label>"
                      + "<input type='text' name='city' class='form-control'></div>");
            out.println(" <div class='col-md-4'><label class='form-label'>State</label>"
                      + "<select name='state' class='form-select'><option>Delhi</option>"
                      + "<option>Bihar</option><option>UP</option></select></div>");
            out.println(" <div class='col-md-2'><label class='form-label'>Zip</label>"
                      + "<input type='text' name='zip' class='form-control'></div>");
            out.println(" <div class='col-12 text-center'>"
                      + "<button type='submit' class='btn btn-primary'>Submit</button></div>");
            out.println("</form></div></body></html>");
        }
    }
}
