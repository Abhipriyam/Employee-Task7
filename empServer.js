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

app.get("/emps", function (req, res) {
  console.log("/emps", req.query);

  let departmentStr = req.query.department;
  let designation = req.query.designation;
  let gender = req.query.gender;

  let arr1 = empData;
  if (departmentStr) {
    let departmentArr = departmentStr.split(",");
    arr1 = arr1.filter((st) =>
      departmentArr.find((c1) => c1 === st.department)
    );
  }
  if (designation) {
    arr1 = arr1.filter((st) => st.designation === designation);
  }
  if (gender) {
    arr1 = arr1.filter((st) => st.gender === gender);
  }

  res.send(arr1);
});
app.get("/emps/:empCode", function (req, res) {
  let empCode = +req.params.empCode;
  // console.log("Id1",id)
  let emp = empData.find((st) => st.empCode === empCode);
  //console.log("Id2",car)
  if (emp) res.send(emp);
  else res.status(404).send("No Empolyee ID found");
});
app.get("/emps/name/:name", function (req, res) {
  let name = req.params.name;
  // console.log("mod1",name)
  const arr1 = empData.filter((st1) => st1.name === name);
  //  console.log("mod2",arr1)
  res.send(arr1);
});
app.post("/emps", function (req, res) {
  let body = req.body;
  console.log(body);
  let maxid = empData.reduce(
    (acc, curr) => (curr.empCode >= acc ? curr.empCode : acc),
    0
  );
  let newid = maxid + 1;
  let newEmp = { empCode: newid, ...body };
  empData.push(newEmp);

  res.send(newEmp);
});
app.put("/emps/:empCode", function (req, res) {
  let empCode = +req.params.empCode;
  let body = req.body;
  let index = empData.findIndex((st) => st.empCode === empCode);
  let updatedEmp = { empCode: empCode, ...body };
  empData[index] = updatedEmp;
  res.send(updatedEmp);
});
app.delete("/emps/:empCode", function (req, res) {
  let empCode = +req.params.empCode;
  let index = empData.findIndex((st) => st.empCode === empCode);
  if (index >= 0) {
    let deleteEmp = empData.splice(index, 1);
    res.send(deleteEmp);
  } else res.status(404).send("NO Empolyee Found");
});
