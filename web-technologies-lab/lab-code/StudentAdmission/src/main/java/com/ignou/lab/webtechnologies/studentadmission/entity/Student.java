package com.ignou.lab.webtechnologies.studentadmission.entity;

import java.util.Date;

public class Student {

    private int id;
    private String name;
    private String emailId;
    private String password;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String zipCode;
    private Date entryDate;
    private String ip;

    public Student() {
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmailId() { return emailId; }
    public void setEmailId(String emailId) { this.emailId = emailId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAddress1() { return address1; }
    public void setAddress1(String address1) { this.address1 = address1; }

    public String getAddress2() { return address2; }
    public void setAddress2(String address2) { this.address2 = address2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public Date getEntryDate() { return entryDate; }
    public void setEntryDate(Date entryDate) { this.entryDate = entryDate; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
}
