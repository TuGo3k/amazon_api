var DataTypes = require("sequelize").DataTypes;
var _book = require("./book");
var _course = require("./course");
var _model = require("./model");
var _teacher = require("./teacher");
var _teacher_course = require("./teacher_course");
var _user = require("./user");

function initModels(sequelize) {
  var book = _book(sequelize, DataTypes);
  var course = _course(sequelize, DataTypes);
  var model = _model(sequelize, DataTypes);
  var teacher = _teacher(sequelize, DataTypes);
  var teacher_course = _teacher_course(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  course.belongsToMany(teacher, { as: 'teacherId_teachers', through: teacher_course, foreignKey: "courseId", otherKey: "teacherId" });
  teacher.belongsToMany(course, { as: 'courseId_courses', through: teacher_course, foreignKey: "teacherId", otherKey: "courseId" });
  teacher_course.belongsTo(course, { as: "course", foreignKey: "courseId"});
  course.hasMany(teacher_course, { as: "teacher_courses", foreignKey: "courseId"});
  teacher_course.belongsTo(teacher, { as: "teacher", foreignKey: "teacherId"});
  teacher.hasMany(teacher_course, { as: "teacher_courses", foreignKey: "teacherId"});
  book.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(book, { as: "books", foreignKey: "user_id"});

  return {
    book,
    course,
    model,
    teacher,
    teacher_course,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
