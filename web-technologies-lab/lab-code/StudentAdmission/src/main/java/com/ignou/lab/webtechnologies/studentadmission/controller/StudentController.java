package com.ignou.lab.webtechnologies.studentadmission.controller;

import com.ignou.lab.webtechnologies.studentadmission.entity.Student;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class StudentController {

    @GetMapping("/")
    public String welcome() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String mainPage() {
        return "dashboard";
    }

    @GetMapping("/stdForm")
    public String studentInputForm(Model theModel) {
        Student student = new Student();
        theModel.addAttribute("student", student);
        return "stdForm";
    }

    @PostMapping("/student/view")
    public String viewStdInfo(@ModelAttribute("student") Student theStudent,
                              Model theModel, HttpServletRequest request) {
        theStudent.setEntryDate(new Date());
        theStudent.setIp(request.getRemoteAddr());
        theModel.addAttribute("student", theStudent);
        return "dashboard";
    }
}
