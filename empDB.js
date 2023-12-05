let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let { empData } = require("./empData.js");
//let fs= require("fs");
//let fname="students.json";
let mysql = require("mysql");
let connData = {
  host: "localhost",
  user: "root",
  password: "",
  database: "testDB",
};
app.get("/emps", function (req, res) {
  let department = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;

  let sql = "SELECT * FROM emps";
  let connection = mysql.createConnection(connData);
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.send(404).send("Not found empolyee Data");
    } else {
      if (department) {
        let departmentArr = department.split(",");
        result = result.filter((fi) =>
          departmentArr.find((f) => f === fi.department)
        );
        console.log(departmentArr);
      }
      if (designation) {
        result = result.filter((fi) => fi.designation == designation);
        //  result = result.filter((fi) => departmentArr.find((f)=> f===fi.department))
        console.log(designation);
      }
      if (gender) {
        result = result.filter((fi) => fi.gender == gender);

        console.log(gender);
      }
      res.send(result);
    }
  });
});

app.get("/emps/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM emps WHERE empCode=?";
  connection.query(sql, empCode, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(result);
      if (result) res.send(result);
      else res.status(404).send("NO Empcode Found");
    }
  });
});
app.get("/emps/:name", function (req, res) {
  let name = req.params.name;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM emps WHERE name=?";
  connection.query(sql, name, function (err, result) {
    if (err) console.log(err);
    else {
      console.log(result);

      if (result) res.send(result);
      else res.status(404).send("NO Emp name Found");
    }
  });
});
app.post("/emps", function (req, res) {
  let body = req.body;
  console.log(body);
  let connection = mysql.createConnection(connData);
  let sql =
    "INSERT INTO emps(empCode,name,department,designation,salary,gender) VALUES (?,?,?,?,?,?)";
  connection.query(
    sql,
    [
      body.empCode,
      body.name,
      body.department,
      body.designation,
      body.salary,
      body.gender,
    ],
    function (err, result) {
      if (err) console.log(err);
      else {
        console.log(result);
        console.log("ID od inserted record : ", result.insertId);
        if (result) res.send(JSON.stringify(result));
        else res.status(404).send("NO Mobile Found");
      }
    }
  );
});
app.put("/emps/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  console.log("id", empCode);
  let body = req.body;
  console.log("bd", body);
  let connection = mysql.createConnection(connData);
  let sql =
    "UPDATE emps SET name=?, department=?, designation=?, salary=?, gender=? WHERE empCode=?";
  connection.query(
    sql,
    [
      body.name,
      body.department,
      body.designation,
      body.salary,
      body.gender,
      empCode,
    ],
    function (err, result) {
      if (err) console.log(err);
      else res.send(result);
      console.log(result);
    }
  );
});

app.delete("/emps/:empCode", function (req, res) {
  let empCode = req.params.empCode;
  let connection = mysql.createConnection(connData);
  let sql1 = "DELETE FROM emps WHERE empCode=? ";
  connection.query(sql1, empCode, function (err, result) {
    if (err) console.log(err);
    else
      console.log("successfully deleted. Affected Rows :", result.affectedRows);
    res.send(result);
  });
});
