import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RequestServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            java.util.Date date = new java.util.Date();
            out.println("Current Date & Time: " + date.toString());
            out.println("<h3>Request Information Example</h3>");
            out.println("Method: " + request.getMethod() + "<br>");
            out.println("Request URI: " + request.getRequestURI() + "<br>");
            out.println("Protocol: " + request.getProtocol() + "<br>");
            out.println("PathInfo: " + request.getPathInfo() + "<br>");
            out.println("Remote Address: " + request.getRemoteAddr());
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Displays request information";
    }
}
