// function Role(permissions) {
//   this.permissions = permissions;
// }

// Role.prototype.can = function (action) {
//   return this.permissions.includes(action);
// };

// const superAdmin = new Role(["create", "update", "delete"]);
// const staff = new Role(["update"]);

// console.log(staff.can("delete")); // false
// console.log(superAdmin.can("delete")); // true


// const fruits = ["apple", "banana", "mango"];

// const staffPermissions = ["read", "update"];

// if (staffPermissions.includes("read")) {
//   console.log("Allowed");
// } else {
//   console.log("Not allowed");
// }

// console.log(fruits.includes("banana")); // true
// console.log(fruits.includes("grapes")); // false
// console.log([NaN].includes(NaN)); // true

// const p1 = Promise.reject("data not found");
// const p2 = Promise.reject("Error occurred");
// const p3 = Promise.reject(3);

// Promise.race([p1, p2, p3]).then(result => {
//   console.log(result); // [1, 2, 3]
// }).catch(err => {
//     console.log(err);
// });


function fetchUser() {
  return new Promise(res =>
    setTimeout(() => res("User"), 500)
  );
}

function fetchPosts() {
  return new Promise(res =>
    setTimeout(() => res("Posts"), 1000)
  );
}

Promise.all([fetchUser(), fetchPosts()])
  .then(([user, posts]) => {
    console.log(user, posts);
  });

